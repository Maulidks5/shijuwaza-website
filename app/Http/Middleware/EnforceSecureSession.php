<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceSecureSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $timeoutSeconds = ((int) config('session.auth_idle_timeout', 10)) * 60;
        $lastActivity = (int) $request->session()->get('auth_last_activity', time());

        if ((time() - $lastActivity) > $timeoutSeconds) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('error', 'Your session expired after 10 minutes of inactivity.');
        }

        $request->session()->put('auth_last_activity', time());
        $request->user()->forceFill(['last_seen_at' => now()])->saveQuietly();

        return $next($request);
    }
}
