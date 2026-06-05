<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if (Schema::hasTable('news_posts')) {
            DB::statement("ALTER TABLE news_posts MODIFY status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft'");
        }

        if (Schema::hasTable('donations')) {
            DB::statement("ALTER TABLE donations MODIFY status ENUM('pending', 'confirmed', 'cancelled', 'archived') NOT NULL DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if (Schema::hasTable('news_posts')) {
            DB::statement("UPDATE news_posts SET status = 'draft' WHERE status = 'archived'");
            DB::statement("ALTER TABLE news_posts MODIFY status ENUM('draft', 'published') NOT NULL DEFAULT 'draft'");
        }

        if (Schema::hasTable('donations')) {
            DB::statement("UPDATE donations SET status = 'cancelled' WHERE status = 'archived'");
            DB::statement("ALTER TABLE donations MODIFY status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending'");
        }
    }
};
