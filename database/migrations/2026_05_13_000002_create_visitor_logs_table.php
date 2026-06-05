<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitor_logs', function (Blueprint $table): void {
            $table->id();
            $table->string('path')->index();
            $table->string('url')->nullable();
            $table->string('referrer')->nullable();
            $table->string('ip_hash', 64)->nullable()->index();
            $table->string('visitor_hash', 64)->nullable()->index();
            $table->string('user_agent')->nullable();
            $table->string('device_type', 30)->nullable()->index();
            $table->timestamp('visited_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitor_logs');
    }
};
