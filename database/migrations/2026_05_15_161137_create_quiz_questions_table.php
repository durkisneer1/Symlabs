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
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->string('course_slug');
            $table->string('chapter_slug');
            $table->string('type')->default('multiple_choice');
            $table->string('topic');
            $table->string('difficulty');
            $table->text('prompt');
            $table->string('answer_pattern')->nullable();
            $table->unsignedInteger('position')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
