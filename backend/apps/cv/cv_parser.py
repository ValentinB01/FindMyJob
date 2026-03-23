import re
import io

try:
    from pdfminer.high_level import extract_text as pdfminer_extract
    PDFMINER_AVAILABLE = True
except ImportError:
    PDFMINER_AVAILABLE = False

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False


def extract_text_from_pdf(file_obj) -> str:
    """Extract raw text from an in-memory PDF file object."""
    text = ""
    file_bytes = file_obj.read()
    file_obj.seek(0)

    if PDFMINER_AVAILABLE:
        try:
            text = pdfminer_extract(io.BytesIO(file_bytes))
        except Exception:
            pass

    if not text.strip() and PYPDF2_AVAILABLE:
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                text += (page.extract_text() or "") + "\n"
        except Exception:
            pass

    return text


def parse_cv(text: str) -> dict:
    """Parse raw CV text into a structured dict."""
    data: dict = {
        "full_name": "",
        "email": "",
        "phone": "",
        "summary": "",
        "skills": [],
        "work_experience": [],
        "education": [],
    }

    if not text.strip():
        return data

    lines = [l.strip() for l in text.splitlines() if l.strip()]

    # Email
    email_re = re.compile(r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b")
    emails = email_re.findall(text)
    if emails:
        data["email"] = emails[0]

    # Phone
    phone_re = re.compile(r"[\+]?[\d][\d\s\-\(\)\.]{7,15}[\d]")
    phones = phone_re.findall(text)
    if phones:
        data["phone"] = phones[0].strip()

    # Name – first short line that isn't email or phone
    for line in lines[:8]:
        if email_re.search(line) or phone_re.search(line):
            continue
        words = line.split()
        if 2 <= len(words) <= 5 and all(w[0].isupper() for w in words if w):
            data["full_name"] = line
            break

    text_lower = text.lower()

    # Skills
    skills_text = _extract_section(text, text_lower, ["skills", "technical skills", "competencies", "technologies", "tech stack"])
    if skills_text:
        raw_skills = re.split(r"[,\n•·|/]", skills_text)
        data["skills"] = [s.strip() for s in raw_skills if 1 < len(s.strip()) < 50][:25]

    # Summary
    summary_text = _extract_section(text, text_lower, ["summary", "profile", "objective", "about me", "about"])
    if summary_text:
        data["summary"] = summary_text[:600]

    # Work experience
    exp_text = _extract_section(text, text_lower, ["experience", "work experience", "employment history", "work history", "professional experience"])
    if exp_text:
        data["work_experience"] = _parse_experience(exp_text)

    # Education
    edu_text = _extract_section(text, text_lower, ["education", "academic background", "qualifications", "academic history"])
    if edu_text:
        data["education"] = _parse_education(edu_text)

    return data


def _extract_section(original: str, lower: str, keywords: list) -> str:
    """Return text of the first matching section."""
    section_headers = [
        "experience", "education", "skills", "projects", "certifications",
        "references", "awards", "languages", "summary", "profile", "objective",
        "contact", "interests", "publications", "competencies", "technologies",
        "work history", "employment", "academic", "about",
    ]

    for kw in keywords:
        pattern = re.compile(rf"(?:^|\n)\s*{re.escape(kw)}\s*[:\n]", re.IGNORECASE)
        match = pattern.search(lower)
        if not match:
            continue
        start = match.end()
        end = len(original)
        for hdr in section_headers:
            if hdr in kw:
                continue
            hdr_pattern = re.compile(rf"(?:^|\n)\s*{re.escape(hdr)}\s*[:\n]", re.IGNORECASE)
            next_m = hdr_pattern.search(lower, start)
            if next_m and next_m.start() < end:
                end = next_m.start()
        return original[start:end].strip()
    return ""


def _parse_experience(text: str) -> list:
    """Very lightweight experience parser – returns a list of job dicts."""
    jobs = []
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    # Group every ~3 lines as one entry (rough heuristic)
    for i in range(0, min(len(lines), 12), 3):
        chunk = lines[i: i + 3]
        jobs.append({
            "role": chunk[0] if chunk else "",
            "company": chunk[1] if len(chunk) > 1 else "",
            "period": chunk[2] if len(chunk) > 2 else "",
            "description": "",
        })
    return jobs[:4]


def _parse_education(text: str) -> list:
    """Very lightweight education parser."""
    edu = []
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for i in range(0, min(len(lines), 6), 2):
        chunk = lines[i: i + 2]
        edu.append({
            "institution": chunk[0] if chunk else "",
            "degree": chunk[1] if len(chunk) > 1 else "",
            "period": "",
            "field": "",
        })
    return edu[:3]
