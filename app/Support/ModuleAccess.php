<?php

namespace App\Support;

class ModuleAccess
{
    public static function modules(): array
    {
        return [
            ['label' => 'View Dashboard', 'permission' => 'view dashboard'],
            ['label' => 'Manage Visibility & Archives', 'permission' => 'manage visibility'],
            ['label' => 'Manage Hero Section', 'permission' => 'manage hero section'],
            ['label' => 'Manage Homepage Stats', 'permission' => 'manage homepage stats'],
            ['label' => 'Manage Programs', 'permission' => 'manage programs'],
            ['label' => 'Manage Updates & Activities', 'permission' => 'manage news'],
            ['label' => 'Manage Announcements', 'permission' => 'manage announcements'],
            ['label' => 'Manage Knowledge & Resources', 'permission' => 'manage resources'],
            ['label' => 'Manage Media Gallery', 'permission' => 'manage media'],
            ['label' => 'Manage Members', 'permission' => 'manage members'],
            ['label' => 'Manage Leadership Profiles', 'permission' => 'manage leadership profiles'],
            ['label' => 'Manage Partners', 'permission' => 'manage partners'],
            ['label' => 'Manage Member Submissions', 'permission' => 'manage member submissions'],
            ['label' => 'Manage Donations', 'permission' => 'manage donations'],
            ['label' => 'Manage Partnership Requests', 'permission' => 'manage partnership requests'],
            ['label' => 'Manage Contact Messages', 'permission' => 'manage contact messages'],
            ['label' => 'Manage Whistleblower Reports', 'permission' => 'manage whistleblower reports'],
            ['label' => 'Manage Visitor Analytics', 'permission' => 'manage visitor analytics'],
            ['label' => 'Manage Site Settings', 'permission' => 'manage settings'],
            ['label' => 'Manage Users', 'permission' => 'manage users'],
        ];
    }

    public static function permissions(): array
    {
        return collect(self::modules())->pluck('permission')->all();
    }

    public static function assignableForRole(string $role): array
    {
        if ($role === 'Super Admin') {
            return self::permissions();
        }

        if ($role === 'Member') {
            return [];
        }

        return collect(self::modules())
            ->reject(fn (array $module) => in_array($module['permission'], ['manage users', 'manage settings'], true))
            ->pluck('permission')
            ->all();
    }
}
