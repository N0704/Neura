<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if unique constraint already exists
        if (Schema::hasTable('friends')) {
            $indexes = DB::select("SHOW INDEX FROM friends WHERE Key_name = 'unique_friendship'");
            if (empty($indexes)) {
                Schema::table('friends', function (Blueprint $table) {
                    $table->unique(['user_id', 'friend_id'], 'unique_friendship');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('friends')) {
            Schema::table('friends', function (Blueprint $table) {
                $table->dropUnique('unique_friendship');
            });
        }
    }
};
