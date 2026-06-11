<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Symfony\Component\HttpFoundation\Response;

class ThrottlePasswordResetRequests
{
    /**
     * Apply focused limiters to Fortify auth actions that do not have one by default.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->routeIs('password.email')) {
            return app(ThrottleRequests::class)->handle($request, $next, 'password-resets');
        }

        if ($request->routeIs('register.store')) {
            return app(ThrottleRequests::class)->handle($request, $next, 'registration');
        }

        return $next($request);
    }
}
