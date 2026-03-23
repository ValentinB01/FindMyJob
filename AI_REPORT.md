# AI Usage Report – Job Hunt Duo

> This document covers AI tool usage throughout the development of Job Hunt Duo.
> Required for grading under: **Development Process with AI (2 points)**

---

## 1. User Story Generation

**Tool used:** Claude 

**Prompt used:**
> "Generate 15 user stories for a job-search platform with two AI agents.
> Format: 'As a <persona>, I want <what>, so that <why>.'
> Organise into 6 epics covering auth, CV management, preferences, job finder agent,
> CV tailor agent, and notifications/tracking."

**Outcome:** Generated the 15 user stories found in `job_hunt_duo_backlog_v2.html`.
Minor refinements were made manually for acceptance criteria clarity.

---

## 2. Architecture & Design

**Tool used:** Claude / Gemini

**Prompts:**
- "Design a dark professional dashboard UI for a job search platform. LinkedIn-style."
- "Suggest a Django project structure for a multi-app REST API with JWT authentication."
- "What's the best approach for PDF parsing in Python – pypdf2 vs pdfminer.six?"

**Outcome:**
- Dark theme with `#0B0F19` base, Volt Blue (`#007AFF`) accent, Outfit + IBM Plex Sans fonts
- Django app split: `users`, `cv`, `preferences`, future `jobs`, `notifications`
- Hybrid PDF parser using both libraries (pdfminer primary, PyPDF2 fallback)

---

## 3. Code Generation

**Tool used:** Claude

**Key generated code:**
- `apps/cv/cv_parser.py` — regex-based CV text extractor with section detection
- `agents/lmstudio_client.py` — OpenAI-compatible HTTP client for LMStudio
- JWT auth views (register, login, me) with djangorestframework-simplejwt
- React AuthContext with interceptor-based token refresh

**AI observation:** The AI correctly used `AbstractBaseUser` for the custom user model
and recommended using `USE_TZ = False` for SQLite compatibility.

---

## 4. Debugging

**Tool used:** Claude

**Example debug session:**
- Issue: `uvicorn server:app` failed to find Django's `app` after migrating from FastAPI
- AI suggestion: Create a `server.py` that sets `DJANGO_SETTINGS_MODULE` and exports
  `app = get_asgi_application()` — uvicorn's entry point remains unchanged
- Result: Django now runs via uvicorn with hot reload

---

## 5. Test Generation

**Tool used:** Claude

**Prompt:**
> "Generate pytest tests for Django REST endpoints covering US-01 to US-06.
> Include edge cases: duplicate email, wrong password, disabling last source."

**Outcome:** `tests/test_api.py` with 15 test cases — all pass.

---

## 6. General Observations

| Aspect | Observation |
|--------|------------|
| Speed | AI reduced boilerplate (serializers, URL configs) from ~2h to ~20 min |
| Accuracy | Hallucinations were rare; most common issue was outdated package versions |
| Agent design | AI correctly identified LMStudio's OpenAI-compatible API format |
| Limitations | Complex PDF parsing heuristics required manual tuning |
| Best practice | Always review AI-generated regex patterns and security-sensitive code |

---

## Example Prompts & Responses

### Prompt for CV parser
> "Write a Python function that extracts name, email, phone, skills, work experience,
> and education from raw text extracted from a PDF CV. Use regex. Handle varying CV formats."

**AI response summary:** Provided the `parse_cv()` function with section detection via
`_extract_section()` helper, regex for email/phone, and heuristic name detection.
Manual adjustments: tightened the name detection criteria, added the pdfminer fallback.

---

*Document last updated: 2025*
