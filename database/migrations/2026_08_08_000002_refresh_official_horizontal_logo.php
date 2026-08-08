<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('site_settings')->updateOrInsert(
            ['key' => 'site_logo'],
            [
                'value' => '/images/shijuwaza-logo-horizontal.png',
                'group' => 'branding',
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );
    }

    public function down(): void
    {
        DB::table('site_settings')
            ->where('key', 'site_logo')
            ->where('value', '/images/shijuwaza-logo-horizontal.png')
            ->delete();
    }
};
