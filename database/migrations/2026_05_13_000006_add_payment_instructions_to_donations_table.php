<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table): void {
            $table->string('reference_number')->nullable()->unique()->after('id');
            $table->timestamp('instructions_sent_at')->nullable()->after('status');
        });

        if (Schema::hasTable('donations') && DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE donations MODIFY status ENUM('pending', 'instructions_sent', 'confirmed', 'cancelled', 'archived') NOT NULL DEFAULT 'pending'");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('donations') && DB::getDriverName() === 'mysql') {
            DB::statement("UPDATE donations SET status = 'pending' WHERE status = 'instructions_sent'");
            DB::statement("ALTER TABLE donations MODIFY status ENUM('pending', 'confirmed', 'cancelled', 'archived') NOT NULL DEFAULT 'pending'");
        }

        Schema::table('donations', function (Blueprint $table): void {
            $table->dropColumn(['reference_number', 'instructions_sent_at']);
        });
    }
};
