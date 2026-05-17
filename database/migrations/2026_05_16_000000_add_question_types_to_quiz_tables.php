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
        $missingQuestionColumns = collect(['course_slug', 'chapter_slug', 'type', 'answer_pattern'])
            ->filter(fn (string $column) => ! Schema::hasColumn('quiz_questions', $column));

        if ($missingQuestionColumns->isNotEmpty()) {
            Schema::table('quiz_questions', function (Blueprint $table) use ($missingQuestionColumns) {
                if ($missingQuestionColumns->contains('course_slug')) {
                    $table->string('course_slug')->default('html')->after('quiz_id');
                }

                if ($missingQuestionColumns->contains('chapter_slug')) {
                    $table->string('chapter_slug')->default('elements-and-tags')->after('course_slug');
                }

                if ($missingQuestionColumns->contains('type')) {
                    $table->string('type')->default('multiple_choice')->after('chapter_slug');
                }

                if ($missingQuestionColumns->contains('answer_pattern')) {
                    $table->string('answer_pattern')->nullable()->after('prompt');
                }
            });
        }

        if (! Schema::hasColumn('quiz_options', 'match_text')) {
            Schema::table('quiz_options', function (Blueprint $table) {
                $table->string('match_text')->nullable()->after('text');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('quiz_options', 'match_text')) {
            Schema::table('quiz_options', function (Blueprint $table) {
                $table->dropColumn('match_text');
            });
        }

        $existingQuestionColumns = collect(['answer_pattern', 'type', 'chapter_slug', 'course_slug'])
            ->filter(fn (string $column) => Schema::hasColumn('quiz_questions', $column));

        if ($existingQuestionColumns->isNotEmpty()) {
            Schema::table('quiz_questions', function (Blueprint $table) use ($existingQuestionColumns) {
                foreach ($existingQuestionColumns as $column) {
                    $table->dropColumn($column);
                }
            });
        }
    }
};
