<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AdminRoleAccessTest extends TestCase
{
    public function test_super_admin_only_routes_use_expected_permissions(): void
    {
        $this->assertRouteHasMiddleware('admin.users.index', 'permission:manage users');
        $this->assertRouteHasMiddleware('admin.users.index', 'role:Super Admin');
        $this->assertRouteHasMiddleware('admin.settings.index', 'permission:manage settings');
        $this->assertRouteHasMiddleware('admin.settings.index', 'role:Super Admin');
        $this->assertRouteHasMiddleware('admin.hero-section.edit', 'permission:manage hero section');
        $this->assertRouteHasMiddleware('admin.stats.index', 'permission:manage homepage stats');
    }

    public function test_admin_submission_routes_use_expected_permissions(): void
    {
        $this->assertRouteHasMiddleware('admin.donations.index', 'permission:manage donations');
        $this->assertRouteHasMiddleware('admin.partnership-requests.index', 'permission:manage partnership requests');
        $this->assertRouteHasMiddleware('admin.contact-messages.index', 'permission:manage contact messages');
    }

    public function test_editor_content_routes_use_expected_permissions(): void
    {
        $this->assertRouteHasMiddleware('admin.programs.index', 'permission:manage programs');
        $this->assertRouteHasMiddleware('admin.news.index', 'permission:manage news');
        $this->assertRouteHasMiddleware('admin.announcements.index', 'permission:manage announcements');
        $this->assertRouteHasMiddleware('admin.resources.index', 'permission:manage resources');
        $this->assertRouteHasMiddleware('admin.media.index', 'permission:manage media');
    }

    public function test_delete_routes_require_delete_records_permission(): void
    {
        $this->assertRouteHasMiddleware('admin.programs.destroy', 'permission:delete records');
        $this->assertRouteHasMiddleware('admin.news.destroy', 'permission:delete records');
        $this->assertRouteHasMiddleware('admin.announcements.destroy', 'permission:delete records');
        $this->assertRouteHasMiddleware('admin.resources.destroy', 'permission:delete records');
        $this->assertRouteHasMiddleware('admin.media.destroy', 'permission:delete records');
        $this->assertRouteHasMiddleware('admin.donations.destroy', 'permission:delete records');
        $this->assertRouteHasMiddleware('admin.contact-messages.destroy', 'permission:delete records');
    }

    public function test_admin_visibility_routes_are_separate_from_editor_edit_permissions(): void
    {
        $this->assertRouteHasMiddleware('admin.programs.visibility', 'permission:manage visibility');
        $this->assertRouteHasMiddleware('admin.news.archive', 'permission:manage visibility');
        $this->assertRouteHasMiddleware('admin.announcements.archive', 'permission:manage visibility');
        $this->assertRouteHasMiddleware('admin.resources.archive', 'permission:manage visibility');
        $this->assertRouteHasMiddleware('admin.media.visibility', 'permission:manage visibility');
    }

    private function assertRouteHasMiddleware(string $routeName, string $middleware): void
    {
        $route = Route::getRoutes()->getByName($routeName);

        $this->assertNotNull($route, "Route [{$routeName}] was not found.");
        $this->assertContains($middleware, $route->gatherMiddleware());
    }
}
