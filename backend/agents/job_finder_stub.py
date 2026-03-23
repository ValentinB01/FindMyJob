"""
Agent 1 – Job Finder Bot (stub).

This module will be fully implemented in Epic 4.
It will use LMStudio (qwen2.5-1.5b-instruct) to:
  - Score job listings against the user's CV using semantic similarity
  - Generate 2-3 sentence summaries of each listing

The job retrieval itself will query Adzuna, RemoteOK, Arbeitnow,
and HN Who's Hiring APIs based on the user's JobPreferences.
"""
import os
from .lmstudio_client import chat_completion

# Model to use for this agent (configurable)
JOB_FINDER_MODEL = os.environ.get("JOB_FINDER_MODEL", "qwen2.5-1.5b-instruct")


def score_job_match(cv_text: str, job_description: str) -> dict:
    """
    [STUB] Score how well a job description matches the user's CV.
    Returns a dict with 'score' (0-100) and 'summary'.
    """
    # TODO (Epic 4 – US-08, US-09): implement real scoring using LMStudio embeddings
    # or a prompt-based approach with qwen2.5-1.5b-instruct
    raise NotImplementedError("Agent 1 scoring will be implemented in Epic 4.")


def fetch_job_listings(preferences: dict, sources: list) -> list:
    """
    [STUB] Fetch job listings from enabled external APIs.

    Sources supported:
      - adzuna    → https://api.adzuna.com/v1/api/jobs
      - remoteok  → https://remoteok.com/api
      - arbeitnow → https://www.arbeitnow.com/api/job-board-api
      - hn_hiring → HN Who's Hiring monthly thread (Algolia HN API)

    Returns a list of normalised job dicts:
      {title, company, location, url, description, salary, source}
    """
    # TODO (Epic 4 – US-07): implement per-source fetchers and deduplication
    raise NotImplementedError("Agent 1 listing fetcher will be implemented in Epic 4.")


def generate_job_summary(job_description: str) -> str:
    """
    [STUB] Use LMStudio to generate a 2-3 sentence summary of a job listing.
    """
    # TODO (Epic 4 – US-09): real implementation below as guide
    # messages = [
    #     {"role": "system", "content": "You summarise job descriptions in 2-3 sentences."},
    #     {"role": "user",   "content": job_description[:2000]},
    # ]
    # return chat_completion(JOB_FINDER_MODEL, messages, temperature=0.3)
    raise NotImplementedError("Agent 1 summary will be implemented in Epic 4.")
