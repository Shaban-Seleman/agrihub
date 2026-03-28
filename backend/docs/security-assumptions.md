# Security Assumptions

- Authentication uses signed JWTs transported in `HttpOnly` cookies.
- `localStorage` is not used for auth tokens.
- CSRF protection is enabled using Spring Security's cookie-backed token repository.
- The backend issues a readable `XSRF-TOKEN` cookie and expects the frontend to send the matching `X-XSRF-TOKEN` header on unsafe requests.
- Frontend request helpers fetch `/api/v1/auth/csrf` when needed so page components do not manage CSRF tokens directly.
- The current deployment expectation remains a trusted same-site topology for frontend and backend, with auth cookies kept `HttpOnly` and `SameSite=Lax`.
- If the deployment model changes to a more permissive cross-site topology, CORS and cookie policy must be re-reviewed before production release.
- OTP delivery is isolated behind `OtpService`.
- `dev` and `test` profiles may use the logging OTP provider for local development only.
- `staging` and `prod` are expected to use a real configured OTP provider and fail closed during startup if provider configuration is missing or disabled.
- Raw OTP values must never be logged through the real provider path.
- Provider failure logs should avoid exposing full phone numbers and currently redact to the final four digits.
- Email delivery is isolated behind `EmailService`.
- `dev` and `test` profiles may use the logging email provider for local development only.
- `staging` and `prod` are expected to use a real configured email provider and fail closed during startup if provider configuration is missing or disabled.
- Provider-style email logs should not include full body content, auth secrets, or full recipient details.
- Donor dashboard exports are aggregated only. No raw user rows, names, phones, or emails are exposed through dashboard endpoints.
