<?php

namespace App\Http\Middleware;

use App\Models\VisitorLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackWebsiteVisitor
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $this->shouldTrack($request, $response)) {
            return $response;
        }

        try {
            VisitorLog::create([
                'path' => '/'.ltrim($request->path(), '/'),
                'url' => str($request->fullUrl())->limit(500)->toString(),
                'referrer' => str($request->headers->get('referer'))->limit(500)->toString() ?: null,
                'ip_hash' => $request->ip() ? hash('sha256', $request->ip().config('app.key')) : null,
                'visitor_hash' => hash('sha256', $request->session()->getId().config('app.key')),
                'user_agent' => str($request->userAgent())->limit(500)->toString(),
                'device_type' => $this->deviceType($request->userAgent() ?? ''),
                'visited_at' => now(),
            ]);
        } catch (\Throwable) {
            // Analytics should never break public browsing if the table is unavailable.
        }

        return $response;
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        if (! $request->isMethod('get') || $response->getStatusCode() >= 400) {
            return false;
        }

        if ($request->expectsJson() || $request->user()?->isAdmin() || $request->user()?->isMember()) {
            return false;
        }

        return ! $request->is([
            'admin',
            'admin/*',
            'member',
            'member/*',
            'login',
            'logout',
            'language/*',
            'build/*',
            'storage/*',
            'images/*',
            'favicon.ico',
            'up',
        ]);
    }

    private function deviceType(string $userAgent): string
    {
        $userAgent = strtolower($userAgent);

        if (str_contains($userAgent, 'tablet') || str_contains($userAgent, 'ipad')) {
            return 'tablet';
        }

        if (str_contains($userAgent, 'mobile') || str_contains($userAgent, 'android') || str_contains($userAgent, 'iphone')) {
            return 'mobile';
        }

        return 'desktop';
    }
}
