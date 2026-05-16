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
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('course_slug');
            $table->nullableMorphs('assignable');
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('opens_at')->nullable();
            $table->dateTime('due_at')->nullable();
            $table->decimal('points', 8, 2)->default(0);

            $table->index(['team_id', 'course_slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
