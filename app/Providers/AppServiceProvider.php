<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    /**
     * Configure app-level bot and abuse protection.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('web', fn (Request $request) => [
            Limit::perMinute(120)->by($request->ip()),
            Limit::perMinutes(5, 300)->by($request->ip()),
        ]);

        RateLimiter::for('heavy', fn (Request $request) => Limit::perMinute(20)
            ->by($this->rateLimitActor($request)));

        RateLimiter::for('classroom-questions', fn (Request $request) => [
            Limit::perMinute(10)->by($this->rateLimitActor($request).'|team:'.$this->routeParameterKey($request, 'current_team')),
            Limit::perMinute(20)->by($request->ip()),
        ]);

        RateLimiter::for('password-resets', fn (Request $request) => [
            Limit::perHour(3)->by($request->ip()),
            Limit::perDay(2)->by($this->normalizedEmail($request)),
        ]);

        RateLimiter::for('registration', fn (Request $request) => [
            Limit::perHour(5)->by($request->ip()),
            Limit::perDay(3)->by($this->normalizedEmail($request)),
        ]);
    }

    protected function rateLimitActor(Request $request): string
    {
        return $request->user()
            ? 'user:'.$request->user()->getAuthIdentifier()
            : 'ip:'.$request->ip();
    }

    protected function normalizedEmail(Request $request): string
    {
        $email = Str::lower((string) $request->input('email'));

        return $email !== '' ? $email : 'ip:'.$request->ip();
    }

    protected function routeParameterKey(Request $request, string $parameter): string
    {
        $value = $request->route($parameter);

        if (is_object($value) && method_exists($value, 'getRouteKey')) {
            return (string) $value->getRouteKey();
        }

        return (string) $value;
    }
}
