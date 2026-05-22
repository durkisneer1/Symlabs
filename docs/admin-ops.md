# Admin Operations

Laravel Cloud runs commands from the environment's **Commands** tab. Commands
should be non-interactive, so pass every value as an option.

## Create or Promote an Admin

Create your first production admin account:

```sh
php artisan symlabs:admin you@example.com --name="Your Name" --password="replace-with-a-strong-password"
```

This command only works while there are zero admin accounts. It marks that first
admin as the only account that can invite more admins. After the first admin
exists, invite additional admins from the admin dashboard instead. If the target
account already exists, the command promotes it to the `admin` role. If the
account is new, the email is marked verified unless `--unverified` is passed.

You can omit `--password` for a new account and the command will print a
temporary password once:

```sh
php artisan symlabs:admin you@example.com --name="Your Name"
```

Change the temporary password after logging in.

## Preview Bot Account Deletions

The pruning command is a dry run unless `--force` is passed. Admin accounts are
never selected for deletion.

Preview unverified accounts older than 48 hours:

```sh
php artisan symlabs:prune-users --unverified-older-than=48
```

Preview accounts from a suspicious email domain:

```sh
php artisan symlabs:prune-users --domain=example.test
```

Preview specific email addresses:

```sh
php artisan symlabs:prune-users --email=bot1@example.test --email=bot2@example.test
```

## Delete Bot Accounts

Re-run the same command with `--force` after reviewing the preview:

```sh
php artisan symlabs:prune-users --unverified-older-than=48 --force
```

Use narrow selectors first. The related user-owned rows are cleaned up by the
database cascade rules where migrations define them.

You can also delete individual non-admin users from **Admin Console -> Users**.

## Invite Additional Admins

After the first admin account exists, the bootstrap command is disabled. New
admins must be invited from **Admin Console -> Users** by the original admin
account.

Admin invitations are email-bound and expire after three days. The invited
person must sign in or register with the invited email address before accepting
the link.
