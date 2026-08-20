<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('media_items')) {
            return;
        }

        if (! Schema::hasColumn('media_items', 'news_post_id')) {
            Schema::table('media_items', function (Blueprint $table): void {
                $table->foreignId('news_post_id')
                    ->nullable()
                    ->after('media_album_id')
                    ->constrained('news_posts')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('media_items', 'news_post_id')) {
            Schema::disableForeignKeyConstraints();

            Schema::table('media_items', function (Blueprint $table): void {
                $table->dropColumn('news_post_id');
            });

            Schema::enableForeignKeyConstraints();
        }
    }
};
