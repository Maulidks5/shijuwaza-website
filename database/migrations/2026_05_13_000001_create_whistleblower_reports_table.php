<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whistleblower_reports', function (Blueprint $table): void {
            $table->id();
            $table->enum('concern_type', [
                'abuse_or_violence',
                'discrimination',
                'harassment',
                'accessibility_concern',
                'other',
            ])->index();
            $table->longText('message');
            $table->string('location')->nullable();
            $table->string('contact_details')->nullable();
            $table->boolean('wants_anonymous')->default(false)->index();
            $table->enum('status', ['new', 'reviewed', 'closed', 'archived'])->default('new')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whistleblower_reports');
    }
};
