"""
Agent 2 – CV Tailor Bot (stub).

This module will be fully implemented in Epic 5.
It will use LMStudio (llama-3.2-3b-instruct) to:
  - Rewrite CV bullet points to match a job description's keywords
  - Generate personalised cover letters
  - Produce a before/after diff with change reasons

The original CV is NEVER modified – all output is a new tailored copy.
"""
import os
from .lmstudio_client import chat_completion

CV_TAILOR_MODEL = os.environ.get("CV_TAILOR_MODEL", "llama-3.2-3b-instruct")


def tailor_cv(original_cv: dict, job_description: str) -> dict:
    """
    [STUB] Rewrite CV bullet points to better match the job description.
    Returns the tailored CV dict + a list of change explanations.
    """
    # TODO (Epic 5 – US-10, US-12): implement real tailoring
    # IMPORTANT: Only rephrase existing content – no fabrication.
    raise NotImplementedError("Agent 2 CV tailoring will be implemented in Epic 5.")


def generate_cover_letter(user_cv: dict, job: dict) -> str:
    """
    [STUB] Generate a personalised cover letter for a specific job.
    Highlights top 3 matching skills. Returns plain text.
    """
    # TODO (Epic 5 – US-11): real implementation guide below
    # messages = [
    #     {"role": "system", "content": (
    #         "You write professional cover letters. Use only the applicant's "
    #         "real experience. Mention the specific company and role."
    #     )},
    #     {"role": "user", "content": f"Job: {job}\n\nMy CV: {user_cv}"},
    # ]
    # return chat_completion(CV_TAILOR_MODEL, messages, temperature=0.6)
    raise NotImplementedError("Agent 2 cover letter will be implemented in Epic 5.")


def diff_cv_sections(original: dict, tailored: dict) -> list:
    """
    [STUB] Produce a list of changes between original and tailored CV.
    Each entry: {section, original_text, tailored_text, reason}.
    """
    # TODO (Epic 5 – US-12)
    raise NotImplementedError("Agent 2 diff will be implemented in Epic 5.")
