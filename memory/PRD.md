# Job Hunt Duo – Product Requirements Document

## Original Problem Statement
Build a base for "Job Hunt Duo" university project (Metode de Dezvoltare Software, Univ. of Bucharest).
Tech stack: Django 4.x + PostgreSQL + React + Docker.
AI agents: LMStudio with qwen2.5-1.5b-instruct (Agent 1) and llama-3.2-3b-instruct (Agent 2) via local API.
Design: dark professional (LinkedIn-style).
Scope for this sprint: US-01 to US-06 (Epics 1–3).

## Architecture

- **Backend**: Django 4.2 ASGI served by uvicorn (`server.py` exports `get_asgi_application()`)
- **Database**: SQLite (dev), PostgreSQL 15 (Docker/prod via `DATABASE_URL`)
- **Auth**: JWT via djangorestframework-simplejwt
- **Frontend**: React 18 + CRA + React Router v7 + Tailwind CSS
- **AI Agents**: LMStudio local API (OpenAI-compatible, `agents/lmstudio_client.py`)
- **Containerisation**: Docker Compose (`docker/docker-compose.yml`)

## User Personas
- **Job Seeker**: University student or early-career professional actively searching for a new role.

## Core Requirements (Static)
1. Custom user model (email as username)
2. JWT auth with 24h access + 7d refresh tokens
3. PDF CV upload with automatic text extraction and parsing
4. Job preferences per user (title, location, work type, seniority)
5. Per-user job source configuration (Adzuna, RemoteOK, Arbeitnow, HN Who's Hiring)
6. At least one source must remain enabled at all times

## What's Been Implemented (Sprint 1 – 2025-03-23)

### Backend
- `apps/users` – Custom User model, register + login + me endpoints (US-01, US-02)
- `apps/cv` – CVProfile model, PDF upload + parse (pypdf2 + pdfminer), edit endpoints (US-03, US-04)
- `apps/preferences` – JobPreferences + JobSource models, CRUD endpoints (US-05, US-06)
- `agents/lmstudio_client.py` – LMStudio HTTP client
- `agents/job_finder_stub.py` – Agent 1 stub with documented TODOs for Epic 4
- `agents/cv_tailor_stub.py` – Agent 2 stub with documented TODOs for Epic 5
- 15 pytest tests — all passing

### Frontend
- Dark professional design (base `#0B0F19`, blue `#007AFF`, Outfit + IBM Plex Sans fonts)
- Auth page: split-screen hero + login/register forms
- Dashboard: welcome, stat cards, setup checklist, agent preview cards
- CV page: drag-and-drop upload zone, parsed data edit form (skills tags, work experience)
- Preferences page: preferences form (work type, seniority selectors) + source toggle cards
- App layout: fixed sidebar + sticky topbar
- Sonner toast notifications

### Docker / DevOps
- `docker/docker-compose.yml` – db (PG15), backend (Django), frontend
- `docker/Dockerfile.backend` + `docker/Dockerfile.frontend`
- `docker/.env.example`
- `README.md` + `AI_REPORT.md`

## Prioritized Backlog

### P0 – Next Sprint (Epic 4: Agent 1 – Job Finder)
- US-07: Scheduled job search via Agent 1 (Celery + Beat or APScheduler)
- US-08: Match score (0–100%) per listing using LMStudio semantic similarity
- US-09: AI-generated 2-3 sentence summary per listing

### P1 – Epic 5: Agent 2 – CV Tailor
- US-10: Tailor CV bullet points for a specific job (llama-3.2-3b-instruct)
- US-11: Generate personalised cover letter (downloadable as .docx/PDF)
- US-12: Before/after diff view with change reasons

### P2 – Epic 6: Digest & Tracking
- US-13: Periodic email digest (top 5 matches)
- US-14: Application pipeline (Applied/Saved/Rejected)
- US-15: Full mobile responsiveness

### Backlog
- CI/CD: GitHub Actions workflow (test on push/PR)
- Architecture diagrams (draw.io): component, use case, agent flow
- GitHub Projects Kanban board
- Automated frontend tests (React Testing Library)
- AI agent evals (output quality scoring)

## Next Tasks
1. Implement Epic 4: integrate Agent 1 with real Adzuna/RemoteOK/Arbeitnow/HN APIs
2. Implement match scoring with LMStudio (qwen2.5-1.5b-instruct)
3. Build Job Listings page in the frontend
4. Add CI/CD GitHub Actions workflow
5. Create architecture diagrams
