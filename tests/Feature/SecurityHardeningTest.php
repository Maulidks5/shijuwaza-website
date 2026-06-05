<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    public function test_admin_routes_prevent_back_button_cache(): void
    {
        $this->assertRouteHasMiddleware('admin.dashboard', 'no_back_history');
        $this->assertRouteHasMiddleware('admin.users.index', 'no_back_history');
        $this->assertRouteHasMiddleware('admin.donations.show', 'no_back_history');
    }

    public function test_login_and_public_forms_are_rate_limited(): void
    {
        $this->assertRouteHasMiddleware('login.store', 'throttle:login');
        $this->assertRouteHasMiddleware('contact.store', 'throttle:6,1');
        $this->assertRouteHasMiddleware('donate.store', 'throttle:6,1');
        $this->assertRouteHasMiddleware('partner-with-us.store', 'throttle:6,1');
    }

    public function test_admin_and_member_login_aliases_use_guest_and_no_cache_middleware(): void
    {
        $this->assertRouteHasMiddleware('login', 'guest');
        $this->assertRouteHasMiddleware('admin.login', 'guest');
        $this->assertRouteHasMiddleware('admin.login', 'no_back_history');
        $this->assertRouteHasMiddleware('member.login', 'guest');
        $this->assertRouteHasMiddleware('member.login', 'no_back_history');
    }

    public function test_authenticated_portals_use_account_and_session_security(): void
    {
        $this->assertRouteHasMiddleware('admin.dashboard', 'account_active');
        $this->assertRouteHasMiddleware('admin.dashboard', 'secure_session');
        $this->assertRouteHasMiddleware('member.dashboard', 'account_active');
        $this->assertRouteHasMiddleware('member.dashboard', 'secure_session');
        $this->assertRouteHasMiddleware('security.close-session', 'auth');
    }

    public function test_user_block_route_is_super_admin_only(): void
    {
        $this->assertRouteHasMiddleware('admin.users.block', 'role:Super Admin');
        $this->assertRouteHasMiddleware('admin.users.block', 'permission:manage users');
        $this->assertRouteHasMiddleware('admin.users.block', 'no_back_history');
    }

    public function test_member_account_block_route_uses_member_management_access(): void
    {
        $this->assertRouteHasMiddleware('admin.members.account-block', 'role_or_permission:Super Admin|manage members');
        $this->assertRouteHasMiddleware('admin.members.account-block', 'no_back_history');
    }

    public function test_login_page_uses_no_cache_headers(): void
    {
        $response = $this->get('/login');

        $cacheControl = $response->headers->get('Cache-Control');

        $this->assertStringContainsString('no-store', $cacheControl);
        $this->assertStringContainsString('no-cache', $cacheControl);
        $this->assertStringContainsString('max-age=0', $cacheControl);
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    private function assertRouteHasMiddleware(string $routeName, string $middleware): void
    {
        $route = Route::getRoutes()->getByName($routeName);

        $this->assertNotNull($route, "Route [{$routeName}] was not found.");
        $this->assertContains($middleware, $route->gatherMiddleware());
    }
}
