<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leadership_profiles', function (Blueprint $table): void {
            $table->enum('tree_position', ['left', 'down', 'right'])
                ->default('down')
                ->after('parent_profile_id')
                ->index();
        });
    }

    public function down(): void
    {
        Schema::table('leadership_profiles', function (Blueprint $table): void {
            $table->dropColumn('tree_position');
        });
    }
};
