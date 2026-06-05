<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table): void {
            $table->id();
            $table->string('donor_name');
            $table->string('donor_email');
            $table->string('donor_phone')->nullable();
            $table->decimal('amount', 14, 2);
            $table->string('currency', 8)->default('TZS');
            $table->enum('donation_type', ['one_time', 'monthly'])->default('one_time')->index();
            $table->enum('payment_method', ['manual', 'bank_transfer', 'mobile_money'])->default('manual')->index();
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending')->index();
            $table->timestamps();
        });

        Schema::create('partnership_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('organization_name');
            $table->string('contact_person');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->enum('partnership_type', [
                'funding',
                'training',
                'advocacy',
                'research',
                'media',
                'technical_support',
                'other',
            ])->default('other')->index();
            $table->longText('message');
            $table->enum('status', ['new', 'reviewed', 'contacted', 'archived'])->default('new')->index();
            $table->timestamps();
        });

        if (Schema::hasTable('contact_messages') && DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE contact_messages MODIFY status ENUM('unread', 'read', 'replied', 'archived') NOT NULL DEFAULT 'unread'");
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('contact_messages') && DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE contact_messages MODIFY status ENUM('unread', 'read', 'archived') NOT NULL DEFAULT 'unread'");
        }

        Schema::dropIfExists('partnership_requests');
        Schema::dropIfExists('donations');
    }
};
