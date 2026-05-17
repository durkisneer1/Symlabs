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
        $missingColumns = collect(['type', 'settings'])
            ->filter(fn (string $column) => ! Schema::hasColumn('assignments', $column));

        if ($missingColumns->isEmpty()) {
            return;
        }

        Schema::table('assignments', function (Blueprint $table) use ($missingColumns) {
            if ($missingColumns->contains('type')) {
                $table->string('type')->default('quiz')->after('created_by');
            }

            if ($missingColumns->contains('settings')) {
                $table->json('settings')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $existingColumns = collect(['settings', 'type'])
            ->filter(fn (string $column) => Schema::hasColumn('assignments', $column));

        if ($existingColumns->isEmpty()) {
            return;
        }

        Schema::table('assignments', function (Blueprint $table) use ($existingColumns) {
            foreach ($existingColumns as $column) {
                $table->dropColumn($column);
            }
        });
    }
};
