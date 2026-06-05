<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsMember;
use App\Http\Middleware\EnsureAccountIsActive;
use App\Http\Middleware\EnforceSecureSession;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PreventBackHistory;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\SetLocale;
use App\Http\Middleware\TrackWebsiteVisitor;
use Illuminate\Http\Request;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->redirectUsersTo(function (Request $request): string {
            if ($request->user()?->isMember()) {
                return route('member.dashboard');
            }

            if ($request->user()?->isAdmin()) {
                return route('admin.dashboard');
            }

            return route('home');
        });

        $middleware->web(append: [
            SetLocale::class,
            HandleInertiaRequests::class,
            SecurityHeaders::class,
            TrackWebsiteVisitor::class,
        ]);

        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
            'member' => EnsureUserIsMember::class,
            'account_active' => EnsureAccountIsActive::class,
            'secure_session' => EnforceSecureSession::class,
            'no_back_history' => PreventBackHistory::class,
            'role' => RoleMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (PostTooLargeException $exception, Request $request) {
            if ($request->is('admin/resources*')) {
                return back()->withErrors([
                    'file_path' => 'The document file is larger than the active PHP server limit. Restart with composer serve, or set upload_max_filesize=20M and post_max_size=24M in PHP settings.',
                ]);
            }

            return null;
        });
    })->create();
