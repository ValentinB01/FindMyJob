"""Backend API tests for Job Hunt Duo - US-01 to US-06"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")

# Test credentials
TEST_EMAIL = "test@jobhunt.dev"
TEST_PASSWORD = "testpass123"
NEW_USER_EMAIL = "TEST_newuser_pytest@jobhunt.dev"
NEW_USER_PASSWORD = "TestPass123!"


@pytest.fixture(scope="module")
def auth_token():
    resp = requests.post(f"{BASE_URL}/api/auth/login/", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    if resp.status_code == 200:
        return resp.json()["tokens"]["access"]
    pytest.skip(f"Auth failed: {resp.status_code} {resp.text}")


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


# US-01: Registration
class TestRegistration:
    def test_register_new_user(self):
        resp = requests.post(f"{BASE_URL}/api/auth/register/", json={
            "email": NEW_USER_EMAIL,
            "password": NEW_USER_PASSWORD,
            "full_name": "Test Pytest User"
        })
        assert resp.status_code == 201, f"Expected 201, got {resp.status_code}: {resp.text}"
        data = resp.json()
        assert "tokens" in data
        assert "user" in data
        assert data["user"]["email"] == NEW_USER_EMAIL

    def test_register_duplicate_email_returns_400(self):
        resp = requests.post(f"{BASE_URL}/api/auth/register/", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
            "full_name": "Duplicate User"
        })
        assert resp.status_code == 400, f"Expected 400, got {resp.status_code}: {resp.text}"


# US-02: Login
class TestLogin:
    def test_login_success(self):
        resp = requests.post(f"{BASE_URL}/api/auth/login/", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
        data = resp.json()
        assert "tokens" in data
        assert "access" in data["tokens"]
        assert "refresh" in data["tokens"]

    def test_login_wrong_password_returns_401(self):
        resp = requests.post(f"{BASE_URL}/api/auth/login/", json={"email": TEST_EMAIL, "password": "wrongpass"})
        assert resp.status_code == 401, f"Expected 401, got {resp.status_code}: {resp.text}"

    def test_me_requires_auth(self):
        resp = requests.get(f"{BASE_URL}/api/auth/me/")
        assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"

    def test_me_with_auth(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/auth/me/", headers=auth_headers)
        assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"
        data = resp.json()
        assert data["email"] == TEST_EMAIL


# US-03: CV Upload
class TestCVUpload:
    def test_upload_cv_requires_auth(self):
        pdf_content = b"%PDF-1.4 test"
        files = {"file": ("test.pdf", io.BytesIO(pdf_content), "application/pdf")}
        resp = requests.post(f"{BASE_URL}/api/cv/upload/", files=files)
        assert resp.status_code == 401

    def test_get_cv_profile(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/cv/profile/", headers=auth_headers)
        assert resp.status_code in [200, 404], f"Got {resp.status_code}: {resp.text}"


# US-04: CV Profile Update
class TestCVProfileUpdate:
    def test_update_cv_profile(self, auth_headers):
        resp = requests.patch(f"{BASE_URL}/api/cv/profile/update/", json={"full_name": "Updated Name"}, headers=auth_headers)
        assert resp.status_code in [200, 404], f"Got {resp.status_code}: {resp.text}"


# US-05: Preferences
class TestPreferences:
    def test_get_preferences(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/preferences/", headers=auth_headers)
        assert resp.status_code == 200, f"Got {resp.status_code}: {resp.text}"

    def test_put_preferences(self, auth_headers):
        get_resp = requests.get(f"{BASE_URL}/api/preferences/", headers=auth_headers)
        current = get_resp.json()
        resp = requests.put(f"{BASE_URL}/api/preferences/", json=current, headers=auth_headers)
        assert resp.status_code == 200, f"Got {resp.status_code}: {resp.text}"

    def test_preferences_requires_auth(self):
        resp = requests.get(f"{BASE_URL}/api/preferences/")
        assert resp.status_code == 401


# US-06: Sources
class TestSources:
    def test_list_sources_returns_4(self, auth_headers):
        resp = requests.get(f"{BASE_URL}/api/preferences/sources/", headers=auth_headers)
        assert resp.status_code == 200, f"Got {resp.status_code}: {resp.text}"
        data = resp.json()
        assert len(data) == 4, f"Expected 4 sources, got {len(data)}"

    def test_toggle_source(self, auth_headers):
        sources_resp = requests.get(f"{BASE_URL}/api/preferences/sources/", headers=auth_headers)
        sources = sources_resp.json()
        enabled = [s for s in sources if s["is_enabled"]]
        if len(enabled) <= 1:
            pytest.skip("Only one source enabled, cannot toggle")
        source_name = enabled[0]["source"]
        resp = requests.patch(f"{BASE_URL}/api/preferences/sources/{source_name}/toggle/", headers=auth_headers)
        assert resp.status_code == 200, f"Got {resp.status_code}: {resp.text}"
        assert resp.json()["is_enabled"] == False
        # Toggle back
        requests.patch(f"{BASE_URL}/api/preferences/sources/{source_name}/toggle/", headers=auth_headers)

    def test_cannot_disable_last_source(self, auth_headers):
        sources_resp = requests.get(f"{BASE_URL}/api/preferences/sources/", headers=auth_headers)
        sources = sources_resp.json()
        enabled = [s for s in sources if s["is_enabled"]]
        # Disable all but the first
        for s in enabled[1:]:
            requests.patch(f"{BASE_URL}/api/preferences/sources/{s['source']}/toggle/", headers=auth_headers)
        last = enabled[0]["source"]
        resp = requests.patch(f"{BASE_URL}/api/preferences/sources/{last}/toggle/", headers=auth_headers)
        assert resp.status_code == 400, f"Expected 400, got {resp.status_code}: {resp.text}"
        # Re-enable all
        for s in enabled[1:]:
            requests.patch(f"{BASE_URL}/api/preferences/sources/{s['source']}/toggle/", headers=auth_headers)
