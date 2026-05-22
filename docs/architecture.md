# Content Storage and Anti-Cheat Architecture

SymLabs will use a hybrid courseware model:

- Canonical lessons, homework definitions, quiz banks, and grading rules live in version-controlled files
- Teacher/class choices, student attempts, grades, and activity logs live in the database
- Homework and quiz generation/grading happen in Laravel, not in browser TypeScript

This keeps curriculum easy for developers to review in Git while still giving teachers control over what their class uses.

## Content Source

Courseware source files live under:

```txt
resources/courseware
```

These files are server-owned. Do not put answer keys, quiz banks, or grading logic in `public/` or `resources/js`.

The courseware files should describe:

- chapters
- lessons
- question banks
- homework generators
- quiz configuration
- grading rules

Use structured JSON/YAML instead of Markdown-only content so lesson pages can render richer custom UI blocks.

## Database State

The database stores app state, not the canonical curriculum.

Store these in the database:

- Teacher/team enabled or disabled courseware items
- Student enrollments and team membership
- Assignment visibility and due dates
- Generated per-student attempt snapshots
- Submitted answers
- Scores and max scores
- Attempt count
- Started/submitted timestamps
- IP address and user agent
- Activity logs

Attempts should be immutable snapshots. If the source courseware changes later, old grades should still reflect the exact questions and generated values the student saw.

## Homework Flow

Homework is graded but low-stakes.

- Students may attempt homework unlimited times.
- Laravel generates procedural values for each attempt.
- The database records the seed, generated questions, submitted answers, score, and timestamps.
- Students can see feedback and correct answers after submitting homework.
- Teachers can inspect how many attempts a student needed.

The browser only receives the generated question data for the current attempt. It should not receive grading formulas or future generated variants.

## Quiz Flow

Quizzes are graded and closer to exam-like.

- Laravel selects the quiz questions when the attempt starts.
- From a bank of 25 questions, select 10 questions server-side.
- Store selected question IDs, answer keys, option order, and seed in the attempt snapshot.
- Send only sanitized question data to the browser.
- Grade submissions in Laravel.
- Delay or suppress answer reveal for quizzes.

For fairness, avoid pure random selection when possible. Prefer balanced selection by topic and difficulty so different students get comparable opportunities.

## Anti-Cheat Defaults

Browser-based assessment cannot be cheat-proof. The goal is to make casual cheating difficult and suspicious behavior visible.

Defaults:

- Never send answer keys to the browser
- Never grade in TypeScript
- Never expose full question banks to frontend bundles
- Generate attempts on the server
- Randomize question order
- Randomize answer order
- Randomize procedural numbers
- Store immutable snapshots
- Log starts, submissions, scores, IP address, user agent, and attempt counts

For higher-stakes quizzes, add stricter controls:

- Attempt limits
- Time windows
- Time limits
- Delayed answer review
- Teacher-visible audit logs
- Balanced question selection
