"""
LMStudio API client (OpenAI-compatible).
LMStudio runs locally on port 1234 by default.
Set LMSTUDIO_BASE_URL in .env to override.
"""
import os
import requests

LMSTUDIO_BASE_URL = os.environ.get("LMSTUDIO_BASE_URL", "http://localhost:1234/v1")
TIMEOUT = 60


def chat_completion(model: str, messages: list, temperature: float = 0.7) -> str:
    """Send a chat completion request to LMStudio and return the reply text."""
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "stream": False,
    }
    try:
        resp = requests.post(
            f"{LMSTUDIO_BASE_URL}/chat/completions",
            json=payload,
            timeout=TIMEOUT,
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
    except requests.RequestException as exc:
        raise RuntimeError(f"LMStudio request failed: {exc}") from exc


def list_models() -> list:
    """Return available models loaded in LMStudio."""
    try:
        resp = requests.get(f"{LMSTUDIO_BASE_URL}/models", timeout=10)
        resp.raise_for_status()
        return [m["id"] for m in resp.json().get("data", [])]
    except requests.RequestException:
        return []
