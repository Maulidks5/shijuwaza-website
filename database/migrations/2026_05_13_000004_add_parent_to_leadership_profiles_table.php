<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leadership_profiles', function (Blueprint $table): void {
            $table->foreignId('parent_profile_id')
                ->nullable()
                ->after('category')
                ->constrained('leadership_profiles')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('leadership_profiles', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('parent_profile_id');
        });
    }
};
