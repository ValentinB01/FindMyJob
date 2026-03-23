# Job Hunt Duo

> AI-powered job search platform — University Project (Metode de Dezvoltare Software, Univ. of Bucharest)

---

## Overview

**Job Hunt Duo** uses two AI agents to automate and personalise the job search:

| Agent | Model | Role |
|-------|-------|------|
| **Agent 1 – Job Finder Bot** | `qwen2.5-1.5b-instruct` via LMStudio | Searches Adzuna, RemoteOK, Arbeitnow & HN Who's Hiring, scores each listing against your CV (Epic 4) |
| **Agent 2 – CV Tailor Bot** | `llama-3.2-3b-instruct` via LMStudio | Rewrites your CV for a specific job and generates cover letters (Epic 5) |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 4.2 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | SQLite (dev) / PostgreSQL 15 (Docker/prod) |
| Frontend | React 18 + React Router v7 |
| Styling | Tailwind CSS + shadcn/ui |
| AI Agents | LMStudio (OpenAI-compatible local API) |
| Containerisation | Docker + Docker Compose |
| CI | GitHub Actions (see `.github/workflows/ci.yml`) |

---

## Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 20+
- [LMStudio](https://lmstudio.ai) running on `localhost:1234` with both models loaded

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8001
```

### Frontend

```bash
cd frontend
yarn install
yarn start          # runs on localhost:3000
```

### Docker (full stack with PostgreSQL)

```bash
cp docker/.env.example docker/.env
# Fill in POSTGRES_PASSWORD and SECRET_KEY
docker compose -f docker/docker-compose.yml up --build
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | (insecure dev key) | Django secret key — change in production |
| `DATABASE_URL` | SQLite | PostgreSQL URL for Docker/prod |
| `DEBUG` | `True` | Set to `False` in production |
| `LMSTUDIO_BASE_URL` | `http://localhost:1234/v1` | LMStudio local API base URL |
| `JOB_FINDER_MODEL` | `qwen2.5-1.5b-instruct` | Model used by Agent 1 |
| `CV_TAILOR_MODEL` | `llama-3.2-3b-instruct` | Model used by Agent 2 |

---

## API Reference

All routes are prefixed with `/api`.

### Authentication (Epic 1)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | US-01 Register account |
| `POST` | `/api/auth/login/` | US-02 Login (returns JWT) |
| `POST` | `/api/auth/refresh/` | Refresh access token |
| `GET`  | `/api/auth/me/` | Get current user |

### CV Management (Epic 2)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cv/upload/` | US-03 Upload PDF, auto-parse |
| `GET`  | `/api/cv/profile/` | Get parsed CV data |
| `PATCH`| `/api/cv/profile/update/` | US-04 Edit CV fields |

### Preferences (Epic 3)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/PUT` | `/api/preferences/` | US-05 Job preferences |
| `GET`     | `/api/preferences/sources/` | US-06 List job sources |
| `PATCH`   | `/api/preferences/sources/<source>/toggle/` | Toggle source on/off |

---

## Project Structure

```
job-hunt-duo/
├── backend/
│   ├── server.py              # ASGI entry point (Django via uvicorn)
│   ├── manage.py
│   ├── jobhunt/               # Django project config
│   │   ├── settings.py
│   │   └── urls.py
│   ├── apps/
│   │   ├── users/             # Epic 1 – Auth
│   │   ├── cv/                # Epic 2 – CV Upload & Parsing
│   │   └── preferences/       # Epic 3 – Preferences & Sources
│   ├── agents/
│   │   ├── lmstudio_client.py # Shared LMStudio HTTP client
│   │   ├── job_finder_stub.py # Agent 1 stub (Epic 4)
│   │   └── cv_tailor_stub.py  # Agent 2 stub (Epic 5)
│   └── tests/
│       └── test_api.py        # pytest test suite (15 tests, all passing)
├── frontend/
│   └── src/
│       ├── pages/             # Auth, Dashboard, CV, Preferences
│       ├── components/        # Sidebar, TopBar, layout
│       ├── context/           # AuthContext (JWT management)
│       └── services/          # Axios API client
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── .env.example
├── README.md
└── AI_REPORT.md
```

---

## Running Tests

### Backend (pytest)

```bash
cd backend && pytest tests/ -v
```

### Frontend

```bash
cd frontend && yarn test
```

---

## Backlog & User Stories

Full backlog: [`job_hunt_duo_backlog_v2.html`](./job_hunt_duo_backlog_v2.html)

**Implemented (Sprint 1):**
- [x] US-01 User registration
- [x] US-02 User login (JWT)
- [x] US-03 CV PDF upload + auto-parsing
- [x] US-04 Edit extracted CV data
- [x] US-05 Job preferences (title, location, work type, seniority)
- [x] US-06 Job source configuration (Adzuna, RemoteOK, Arbeitnow, HN)

**Upcoming:**
- [ ] US-07–09 Agent 1: Job Finder Bot (Epic 4)
- [ ] US-10–12 Agent 2: CV Tailor Bot (Epic 5)
- [ ] US-13–15 Email digest, tracking, mobile UX (Epic 6)

---

## Architecture Diagrams

> TODO (required for submission): Create in draw.io and link below.
> 1. Component Architecture Diagram (Docker services)
> 2. UML Use Case Diagram (Job Seeker actor)
> 3. AI Agent Flow Diagram (Agent 1 + Agent 2)

---

## AI Usage Report

See [AI_REPORT.md](./AI_REPORT.md)

---

## License

University project — University of Bucharest, 2025.
