# Security Policy

## 🔐 Security at RoadsRiser

Security is an important part of the RoadsRiser platform.

RoadsRiser is designed with protected authentication, role-based access, server-side validation and environment-based configuration for sensitive credentials.

---

## 🚨 Reporting a Security Vulnerability

If you discover a potential security vulnerability in RoadsRiser, please do not disclose it publicly through a GitHub Issue, Pull Request or other public channel.

Instead, contact the project maintainer privately using the official contact information provided by the RoadsRiser application.

Please provide:

- A clear description of the issue
- Steps required to reproduce it
- The affected component or endpoint
- Potential security impact
- Any relevant screenshots or logs

Please avoid including real user information or credentials in your report.

---

## 🔒 Sensitive Information

Never publish or submit the following information to this repository:

- Passwords
- API keys
- JWT secrets
- Database credentials
- MongoDB connection strings
- OTP secrets or codes
- Access tokens
- Refresh tokens
- Private keys
- Production environment files
- Production database exports
- Real user or mechanic information

Use environment variables for sensitive configuration.

---

## 🧪 Security Testing

Security testing should be performed responsibly and only against systems for which you have authorization.

Do not attempt to:

- Access another user's account
- Access private production data
- Modify production records without authorization
- Perform denial-of-service attacks
- Expose credentials
- Abuse third-party services

---

## 🛡️ Application Security Practices

RoadsRiser includes application-level security practices such as:

- Protected API routes
- Authentication middleware
- Role-specific authorization
- Server-side validation
- Geographic coordinate validation
- Authentication rate limiting
- Environment-based secrets
- Server-side fare calculation
- HTTPS in production

Security practices may evolve as the platform develops.

---

## 📢 Responsible Disclosure

Please allow reasonable time for the project maintainer to investigate and address a reported vulnerability before publicly disclosing security details.

Thank you for helping keep RoadsRiser and its users safe.
