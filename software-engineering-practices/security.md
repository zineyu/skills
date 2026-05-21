# Layer 3: Security Development

## OWASP Top 10 (2021)

1. **Broken Access Control**: Enforce server-side access control, deny by default
2. **Cryptographic Failures**: Encrypt data in transit (TLS 1.3) and at rest
3. **Injection**: Use parameterized queries, validate input, escape output
4. **Insecure Design**: Threat modeling, secure design patterns, least privilege
5. **Security Misconfiguration**: Minimal platform, disable unused features, patch
6. **Vulnerable Components**: Dependency scanning, keep libraries updated
7. **Authentication Failures**: MFA, strong passwords, session management
8. **Data Integrity Failures**: Sign data, verify integrity, no untrusted deserialization
9. **Logging Failures**: Log security events, monitor for attacks
10. **Server-Side Request Forgery (SSRF)**: Validate URLs, whitelist destinations

## Input Validation

- **Whitelist, not blacklist**: Define allowed input, reject everything else
- **Validate at boundaries**: API endpoints, form submissions, file uploads
- **Type safety**: Use strong types, avoid stringly-typed APIs
- **Length limits**: Prevent buffer overflows and DoS
- **Sanitize output**: Escape HTML, JavaScript, CSS, SQL
- **File upload restrictions**: Validate MIME type, size, scan for malware
- **Rate limiting**: Prevent brute force and DoS

```go
// Example: Input validation with whitelist
 type CreateUserRequest struct {
  Email    string `json:"email" validate:"required,email"`
  Username string `json:"username" validate:"required,alphanum,min=3,max=30"`
  Age      int    `json:"age" validate:"gte=13,lte=120"`
}

func (r *CreateUserRequest) Validate() error {
  validate := validator.New()
  return validate.Struct(r)
}
```

## Authentication & Authorization

- **Never roll your own crypto**: Use established libraries (bcrypt, Argon2)
- **Password storage**: Hash with salt (bcrypt/Argon2), never plaintext
- **JWT**: Short expiry (15-30 min), use refresh tokens, store securely
- **Session management**: Secure cookies (httpOnly, Secure, SameSite)
- **OAuth 2.0 / OpenID Connect**: Use standard flows, validate state parameter
- **RBAC**: Role-based access control (admin, editor, viewer)
- **ABAC**: Attribute-based for fine-grained control
- **Principle of Least Privilege**: Minimum permissions needed

```http
# Secure cookie headers
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600
```

## Web Application Security

- **XSS Prevention**: Escape output, CSP headers, sanitize HTML
- **CSRF Protection**: CSRF tokens, SameSite cookies, validate Origin
- **SQL Injection**: Parameterized queries, ORM, never string concatenation
- **Command Injection**: Avoid shell execution; use exec with array args
- **Path Traversal**: Validate file paths, chroot jails
- **Clickjacking**: X-Frame-Options, CSP frame-ancestors
- **HSTS**: Strict-Transport-Security header
- **Content Security Policy**: Restrict sources for scripts, styles, etc.

```http
# Security headers
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Secrets Management

- **Never commit secrets**: Use `.gitignore`, pre-commit hooks
- **Environment variables**: For config, not for secrets in production
- **Secret management tools**: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault
- **Key rotation**: Regular rotation, automated where possible
- **Audit access**: Log who accessed what secret when
- **Separate environments**: Dev/staging/prod use different secrets

## Dependency Security

- **Audit regularly**: `npm audit`, `cargo audit`, `go mod verify`
- **Vulnerability scanning**: Snyk, Dependabot, OWASP Dependency-Check
- **Pin versions**: Lock files for reproducible builds
- **Minimal dependencies**: Fewer dependencies = smaller attack surface
- **License compliance**: Ensure licenses are compatible

## Security Headers Checklist

| Header | Purpose | Recommended Value |
|--------|---------|-------------------|
| Content-Security-Policy | XSS mitigation | `default-src 'self'` |
| X-Frame-Options | Clickjacking | `DENY` or `SAMEORIGIN` |
| X-Content-Type-Options | MIME sniffing | `nosniff` |
| Strict-Transport-Security | HTTPS enforcement | `max-age=31536000` |
| Referrer-Policy | Privacy | `strict-origin-when-cross-origin` |
| Permissions-Policy | Feature restriction | `geolocation=(), microphone=()` |

## Security Review Checklist

- [ ] All inputs validated (whitelist approach)
- [ ] SQL queries parameterized
- [ ] Output escaped/sanitized
- [ ] Authentication enforced for protected routes
- [ ] Authorization checks server-side
- [ ] Secrets not in code/config
- [ ] HTTPS only (HSTS enabled)
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies audited for CVEs
- [ ] Logging covers security events (login, access denied)