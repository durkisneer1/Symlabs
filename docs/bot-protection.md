Email verification:

- Will be deleted in 72 hours
- Cannot join/create classrooms

Rate Limits:

- Email verification resend attempts
- Registration/login attempts by IP and email
- Password resets maybe once a week/month unless overridden by admin
- QAs by teachers and students
- 429 page to put people in time-out (by IP and user if applicable)
  - AI suggestion: "You’re moving a little fast. Please wait a few minutes and try again."
  - 120 requests per minute or 300 per 5 minutes for cheap requests
  - 20 requests per minute for heavy server tasks/queries

CAPTCHA (Cloudflare Turnstile):

- Signup
- Password reset
