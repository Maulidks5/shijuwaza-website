<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AdminProfileRouteTest extends TestCase
{
    public function test_profile_routes_exist_for_authenticated_admin_area(): void
    {
        $this->assertRouteHasMiddleware('admin.profile.show', 'auth');
        $this->assertRouteHasMiddleware('admin.profile.show', 'admin');
        $this->assertRouteHasMiddleware('admin.profile.update', 'auth');
        $this->assertRouteHasMiddleware('admin.profile.password', 'auth');
    }

    public function test_profile_routes_do_not_require_content_permissions(): void
    {
        $middleware = Route::getRoutes()->getByName('admin.profile.show')->gatherMiddleware();

        $this->assertNotContains('permission:manage users', $middleware);
        $this->assertNotContains('permission:manage settings', $middleware);
        $this->assertNotContains('permission:manage news', $middleware);
    }

    private function assertRouteHasMiddleware(string $routeName, string $middleware): void
    {
        $route = Route::getRoutes()->getByName($routeName);

        $this->assertNotNull($route, "Route [{$routeName}] was not found.");
        $this->assertContains($middleware, $route->gatherMiddleware());
    }
}
