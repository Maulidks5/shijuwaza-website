<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function create(Request $request): Response
    {
        $portal = $request->route('portal');

        return Inertia::render('Auth/Login', [
            'portal' => in_array($portal, ['admin', 'member'], true) ? $portal : 'portal',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::validate($credentials)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->onlyInput('email');
        }

        if (Auth::check()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        Auth::attempt($credentials, $request->boolean('remember'));
        $request->session()->regenerate();
        $user = $request->user();

        if ($user?->isBlocked()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'This account has been blocked. Please contact the system administrator.',
            ])->onlyInput('email');
        }

        if (! $user?->isAdmin() && ! $user?->isMember()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return back()->withErrors([
                'email' => 'This account does not have portal access.',
            ]);
        }

        $request->session()->put('auth_last_activity', time());
        $user->forceFill(['last_seen_at' => now()])->saveQuietly();

        if ($user->isMember()) {
            return redirect()->route('member.dashboard');
        }

        return redirect()->route('admin.dashboard');
    }

    public function closeSession(Request $request): \Illuminate\Http\Response
    {
        if ($request->user()) {
            DB::table('sessions')->where('id', $request->session()->getId())->delete();
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
