<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isAdmin()) {
            if ($request->user()?->isMember()) {
                return redirect()->route('member.dashboard')->with('error', 'You are signed in as a member. Use the member portal for this account.');
            }

            return redirect()->route('login');
        }

        return $next($request);
    }
}
