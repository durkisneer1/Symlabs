<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AdminInvitation;
use App\Models\User;
use App\Notifications\AdminInvitationNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display admin user management.
     */
    public function index(Request $request): Response
    {
        $this->authorizeAdmin($request);

        return Inertia::render('admin/users', [
            'adminInvitations' => $request->user()->can_invite_admins
                ? $this->adminInvitations()
                : [],
            'canInviteAdmins' => $request->user()->can_invite_admins,
            'users' => $this->users(),
        ]);
    }

    /**
     * Invite an email address to become an admin.
     */
    public function invite(Request $request): RedirectResponse
    {
        $this->authorizeAdminInviter($request);

        $data = $request->validate([
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::notIn([$request->user()->email]),
            ],
        ]);

        $existingUser = User::query()
            ->whereRaw('lower(email) = ?', [$data['email']])
            ->first();

        if ($existingUser?->role === UserRole::Admin) {
            throw ValidationException::withMessages([
                'email' => __('That user is already an admin.'),
            ]);
        }

        $invitation = AdminInvitation::query()->updateOrCreate(
            [
                'email' => $data['email'],
                'accepted_at' => null,
            ],
            [
                'invited_by' => $request->user()->id,
                'expires_at' => now()->addDays(3),
            ],
        );

        Notification::route('mail', $invitation->email)
            ->notify(new AdminInvitationNotification($invitation));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Admin invitation sent.')]);

        return to_route('admin.users.index');
    }

    /**
     * Cancel an admin invitation.
     */
    public function cancelInvitation(Request $request, AdminInvitation $invitation): RedirectResponse
    {
        $this->authorizeAdminInviter($request);

        abort_unless($invitation->accepted_at === null, 404);

        $invitation->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Admin invitation cancelled.')]);

        return to_route('admin.users.index');
    }

    /**
     * Accept an admin invitation.
     */
    public function acceptInvitation(Request $request, AdminInvitation $invitation): RedirectResponse
    {
        $user = $request->user();

        abort_unless($invitation->isPending(), 404);
        abort_unless(strtolower($user->email) === strtolower($invitation->email), 403);

        DB::transaction(function () use ($user, $invitation) {
            $user->forceFill([
                'role' => UserRole::Admin,
                'can_invite_admins' => false,
                'email_verified_at' => $user->email_verified_at ?: now(),
            ])->save();

            $invitation->update(['accepted_at' => now()]);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Admin invitation accepted.')]);

        return to_route('dashboard.global');
    }

    /**
     * Delete a non-admin user account.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorizeAdmin($request);

        abort_unless($user->role !== UserRole::Admin, 403);

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User account deleted.')]);

        return to_route('admin.users.index');
    }

    protected function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === UserRole::Admin, 403);
    }

    protected function authorizeAdminInviter(Request $request): void
    {
        $this->authorizeAdmin($request);

        abort_unless($request->user()->can_invite_admins, 403);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function adminInvitations(): array
    {
        return AdminInvitation::query()
            ->with('inviter:id,name,email')
            ->latest()
            ->get()
            ->map(fn (AdminInvitation $invitation) => [
                'code' => $invitation->code,
                'email' => $invitation->email,
                'accepted_at' => $invitation->accepted_at?->toISOString(),
                'expires_at' => $invitation->expires_at?->toISOString(),
                'created_at' => $invitation->created_at?->toISOString(),
                'inviter' => $invitation->inviter ? [
                    'name' => $invitation->inviter->name,
                    'email' => $invitation->inviter->email,
                ] : null,
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function users(): array
    {
        return User::query()
            ->latest()
            ->get([
                'id',
                'name',
                'email',
                'role',
                'can_invite_admins',
                'email_verified_at',
                'created_at',
            ])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'can_invite_admins' => $user->can_invite_admins,
                'email_verified_at' => $user->email_verified_at?->toISOString(),
                'created_at' => $user->created_at?->toISOString(),
            ])
            ->all();
    }
}
