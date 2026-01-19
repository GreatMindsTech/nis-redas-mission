<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->boolean('all_day')->default(false);
            $table->enum('category', ['meeting', 'deadline', 'mission', 'personal', 'other'])->default('other');
            $table->string('location')->nullable();
            $table->string('color')->default('#1b7b3c');
            $table->boolean('is_recurring')->default(false);
            $table->string('recurrence_pattern')->nullable();
            $table->dateTime('recurrence_end_date')->nullable();
            $table->json('attendees')->nullable();
            $table->boolean('reminder_enabled')->default(false);
            $table->integer('reminder_minutes_before')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'start_date']);
            $table->index('start_date');
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
