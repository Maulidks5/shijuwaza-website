<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsMember
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isMember()) {
            if ($request->user()?->isAdmin()) {
                return redirect()->route('admin.dashboard')->with('error', 'You are signed in as an admin. Use the admin panel for this account.');
            }

            return redirect()->route('login');
        }

        return $next($request);
    }
}
