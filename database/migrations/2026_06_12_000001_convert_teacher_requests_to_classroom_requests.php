<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('teacher_account_requests', function (Blueprint $table) {
            $table->string('course_name')->nullable()->after('instructor_title');
            $table->unsignedInteger('expected_student_count')->nullable()->after('course_name');
            $table->foreignId('team_id')->nullable()->after('requester_id')->constrained('teams')->nullOnDelete();
        });

        DB::table('teacher_account_requests')
            ->whereNull('course_name')
            ->update([
                'course_name' => DB::raw('institution'),
            ]);

        DB::table('users')
            ->whereIn('role', ['teacher', 'student'])
            ->update(['role' => 'member']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teacher_account_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_id');
            $table->dropColumn(['course_name', 'expected_student_count']);
        });
    }
};
