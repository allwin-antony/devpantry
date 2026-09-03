#!/usr/bin/env python3
"""
normalize_user.py
Demonstrates how to normalize raw authentication response payloads from
Google, Microsoft Entra, GitHub, Supabase, and Keycloak into a single unified User schema.
"""

import json
import uuid
from datetime import datetime, timezone


def normalize_google(payload):
    """Normalize Google ID token or userinfo response."""
    return {
        "id": str(uuid.uuid4()),
        "provider": "google",
        "provider_user_id": payload.get("sub"),
        "email": payload.get("email"),
        "email_verified": payload.get("email_verified", False),
        "display_name": payload.get("name"),
        "first_name": payload.get("given_name"),
        "last_name": payload.get("family_name"),
        "avatar_url": payload.get("picture"),
        "tenant_id": None,
        "roles": ["member"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login_at": datetime.now(timezone.utc).isoformat()
    }


def normalize_microsoft(id_token_claims, graph_me=None):
    """Normalize Microsoft Entra ID token claims and optional Graph /me response."""
    email = id_token_claims.get("preferred_username") or (graph_me.get("mail") if graph_me else None)
    display_name = (graph_me.get("displayName") if graph_me else None) or id_token_claims.get("name")
    
    return {
        "id": str(uuid.uuid4()),
        "provider": "microsoft",
        "provider_user_id": id_token_claims.get("oid") or id_token_claims.get("sub"),
        "email": email,
        "email_verified": True, # Enterprise directories verify emails
        "display_name": display_name,
        "first_name": graph_me.get("givenName") if graph_me else None,
        "last_name": graph_me.get("surname") if graph_me else None,
        "avatar_url": None,
        "tenant_id": id_token_claims.get("tid"),
        "roles": id_token_claims.get("roles", ["member"]),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login_at": datetime.now(timezone.utc).isoformat()
    }


def normalize_github(user_profile, emails=None):
    """Normalize GitHub user profile and emails array."""
    primary_email = user_profile.get("email")
    verified = False

    if emails:
        for e in emails:
            if e.get("primary"):
                primary_email = e.get("email")
                verified = e.get("verified", False)
                break

    return {
        "id": str(uuid.uuid4()),
        "provider": "github",
        "provider_user_id": str(user_profile.get("id")),
        "email": primary_email,
        "email_verified": verified,
        "display_name": user_profile.get("name") or user_profile.get("login"),
        "first_name": None,
        "last_name": None,
        "avatar_url": user_profile.get("avatar_url"),
        "tenant_id": None,
        "roles": ["member"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "last_login_at": datetime.now(timezone.utc).isoformat()
    }


def normalize_supabase(session_user):
    """Normalize Supabase auth.users object."""
    metadata = session_user.get("user_metadata", {})
    return {
        "id": session_user.get("id"), # Supabase already provides a UUID
        "provider": session_user.get("app_metadata", {}).get("provider", "supabase"),
        "provider_user_id": session_user.get("id"),
        "email": session_user.get("email"),
        "email_verified": bool(session_user.get("email_confirmed_at")),
        "display_name": metadata.get("full_name") or metadata.get("name"),
        "first_name": None,
        "last_name": None,
        "avatar_url": metadata.get("avatar_url"),
        "tenant_id": None,
        "roles": [session_user.get("role", "authenticated")],
        "created_at": session_user.get("created_at"),
        "last_login_at": session_user.get("last_sign_in_at")
    }


def main():
    print("==================================================================")
    print(" SSO Profile Normalizer Demonstration                             ")
    print("==================================================================")
    
    # Test Google Sample
    sample_google = {
        "sub": "109876543210987654321",
        "email": "developer.user@gmail.com",
        "email_verified": True,
        "name": "Jane Developer",
        "given_name": "Jane",
        "family_name": "Developer",
        "picture": "https://lh3.googleusercontent.com/a/sample=s96-c"
    }
    norm_google = normalize_google(sample_google)
    print("\n1. Normalized Google SSO User:")
    print(json.dumps(norm_google, indent=2))

    # Test Microsoft Sample
    sample_ms_jwt = {
        "oid": "24b3c99a-1122-3344-5566-778899aabbcc",
        "tid": "9188040d-6c67-4c5b-b112-36a304b66dad",
        "preferred_username": "alex.morgan@enterprise.com",
        "name": "Alex Morgan",
        "roles": ["Admin", "SecurityAuditor"]
    }
    norm_ms = normalize_microsoft(sample_ms_jwt)
    print("\n2. Normalized Microsoft Entra SSO User:")
    print(json.dumps(norm_ms, indent=2))

    # Test GitHub Sample
    sample_gh = {
        "id": 583231,
        "login": "octocat",
        "name": "The Octocat",
        "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4"
    }
    sample_gh_emails = [
        {"email": "octocat@github.com", "primary": True, "verified": True}
    ]
    norm_gh = normalize_github(sample_gh, sample_gh_emails)
    print("\n3. Normalized GitHub User:")
    print(json.dumps(norm_gh, indent=2))


if __name__ == "__main__":
    main()
