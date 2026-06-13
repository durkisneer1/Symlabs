<?php

namespace App\Notifications;

use App\Models\AdminInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminInvitationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public AdminInvitation $invitation)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $inviter = $this->invitation->inviter;

        return (new MailMessage)
            ->subject(__('You have been invited to administer Symlabs'))
            ->greeting(__('You are invited to administer Symlabs'))
            ->line(__(':inviterName invited you to become a Symlabs admin.', [
                'inviterName' => $inviter->name,
            ]))
            ->line(__('Sign in or create an account with this email address before accepting.'))
            ->action(__('Accept admin invitation'), url("/admin/invitations/{$this->invitation->code}/accept"));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invitation_id' => $this->invitation->id,
            'email' => $this->invitation->email,
        ];
    }
}
