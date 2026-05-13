<?php

namespace App\Http\Controllers\Courseware;

use App\Courseware\CoursewareRepository;
use App\Enums\TeamRole;
use App\Http\Controllers\Controller;
use App\Models\CoursewareActivityLog;
use App\Models\CoursewareItemSetting;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CoursewareController extends Controller
{
    public function __construct(private readonly CoursewareRepository $courseware)
    {
        //
    }

    /**
     * Show available courseware for the current team.
     */
    public function index(Request $request, Team $current_team): Response
    {
        $currentTeam = $current_team;
        $settings = CoursewareItemSetting::query()
            ->whereBelongsTo($currentTeam)
            ->get()
            ->keyBy(fn (CoursewareItemSetting $setting) => "{$setting->content_type}:{$setting->content_id}");

        $canManage = $request->user()->teamRole($currentTeam)?->isAtLeast(TeamRole::Admin) ?? false;
        $chapters = $this->courseware->chapters()
            ->map(function (array $chapter) use ($settings, $canManage) {
                $chapter['items'] = collect($chapter['items'])
                    ->map(function (array $item) use ($settings) {
                        $setting = $settings->get("{$item['type']}:{$item['id']}");

                        return [
                            ...$item,
                            'enabled' => $setting?->enabled ?? true,
                        ];
                    })
                    ->filter(fn (array $item) => $canManage || $item['enabled'])
                    ->values()
                    ->all();

                return $chapter;
            })
            ->filter(fn (array $chapter) => count($chapter['items']) > 0)
            ->values();

        return Inertia::render('courseware/index', [
            'chapters' => $chapters,
            'canManage' => $canManage,
        ]);
    }

    /**
     * Show a server-authored lesson.
     */
    public function lesson(Team $current_team, string $lesson): Response
    {
        $currentTeam = $current_team;
        $this->ensureEnabled($currentTeam, 'lesson', $lesson);

        return Inertia::render('courseware/lesson', [
            'lesson' => $this->courseware->find('lesson', $lesson),
        ]);
    }

    /**
     * Toggle a team courseware item on or off.
     */
    public function toggle(Request $request, Team $current_team): RedirectResponse
    {
        $currentTeam = $current_team;
        abort_unless($request->user()->teamRole($currentTeam)?->isAtLeast(TeamRole::Admin), 403);

        $validated = $request->validate([
            'content_type' => ['required', 'in:lesson,homework,quiz'],
            'content_id' => ['required', 'string'],
            'enabled' => ['required', 'boolean'],
        ]);

        $this->courseware->find($validated['content_type'], $validated['content_id']);

        CoursewareItemSetting::query()->updateOrCreate(
            [
                'team_id' => $currentTeam->id,
                'content_type' => $validated['content_type'],
                'content_id' => $validated['content_id'],
            ],
            ['enabled' => $validated['enabled']],
        );

        CoursewareActivityLog::query()->create([
            'team_id' => $currentTeam->id,
            'user_id' => $request->user()->id,
            'event' => 'courseware.item_toggled',
            'metadata' => $validated,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return back();
    }

    private function ensureEnabled(Team $team, string $type, string $id): void
    {
        $enabled = CoursewareItemSetting::query()
            ->whereBelongsTo($team)
            ->where('content_type', $type)
            ->where('content_id', $id)
            ->value('enabled');

        abort_if($enabled === false, 404);
    }
}
