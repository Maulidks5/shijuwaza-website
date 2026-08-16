<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news_posts', function (Blueprint $table): void {
            $table->string('related_link_type')->nullable()->after('sort_order');
            $table->string('related_link_url', 2048)->nullable()->after('related_link_type');
            $table->string('related_link_label')->nullable()->after('related_link_url');
        });
    }

    public function down(): void
    {
        Schema::table('news_posts', function (Blueprint $table): void {
            $table->dropColumn(['related_link_type', 'related_link_url', 'related_link_label']);
        });
    }
};
