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
        // Check if table already exists
        if (!Schema::hasTable('follows')) {
            Schema::create('follows', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('follower_id');
                $table->unsignedBigInteger('following_id');
                $table->timestamp('created_at')->useCurrent();
                
                // Ensure unique follow relationship
                $table->unique(['follower_id', 'following_id'], 'unique_follow');
                
                // Add foreign keys
                $table->foreign('follower_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('following_id')->references('id')->on('users')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
