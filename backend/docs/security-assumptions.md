# Security Assumptions

- Authentication uses signed JWTs transported in `HttpOnly` cookies.
- `localStorage` is not used for auth tokens.
- CSRF protection is currently disabled in [`SecurityConfig.java`](/Users/shabani.chande/Documents/projects/AGRIHUB/agrihub/backend/src/main/java/com/samiagrihub/common/security/SecurityConfig.java).
- This is only acceptable for the MVP if the frontend and backend are deployed under the same trusted site boundary and the cookie remains `SameSite=Lax` or stricter.
- If the deployment model changes to cross-site requests, CSRF protection must be enabled before production release.
- OTP delivery and email delivery are intentionally isolated behind `OtpService` and `EmailService`; the current implementations only log in dev-style environments and are not real outbound integrations.
- Donor dashboard exports are aggregated only. No raw user rows, names, phones, or emails are exposed through dashboard endpoints.
