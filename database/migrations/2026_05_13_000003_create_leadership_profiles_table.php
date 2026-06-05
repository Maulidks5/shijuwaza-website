<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leadership_profiles', function (Blueprint $table): void {
            $table->id();
            $table->enum('category', ['secretariat', 'board', 'nec'])->index();
            $table->string('full_name');
            $table->string('position');
            $table->text('short_bio')->nullable();
            $table->longText('bio')->nullable();
            $table->string('photo')->nullable();
            $table->integer('sort_order')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leadership_profiles');
    }
};
