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
        Schema::create('courseware_item_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('content_type');
            $table->string('content_id');
            $table->boolean('enabled')->default(true);
            $table->timestamp('available_at')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamps();

            $table->unique(['team_id', 'content_type', 'content_id']);
        });

        Schema::create('courseware_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('content_type');
            $table->string('content_id');
            $table->unsignedInteger('attempt_number');
            $table->unsignedBigInteger('seed');
            $table->string('status')->default('in_progress');
            $table->json('snapshot');
            $table->json('answers')->nullable();
            $table->decimal('score', 8, 2)->nullable();
            $table->decimal('max_score', 8, 2);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index(['team_id', 'user_id', 'content_type', 'content_id']);
            $table->index(['status', 'started_at']);
        });

        Schema::create('courseware_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('courseware_attempt_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event');
            $table->json('metadata')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index(['team_id', 'event']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courseware_activity_logs');
        Schema::dropIfExists('courseware_attempts');
        Schema::dropIfExists('courseware_item_settings');
    }
};
