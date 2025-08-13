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
        Schema::table('salary_details', function (Blueprint $table) {
            // Add a new column to store the currency code (e.g., "KES", "USD")
            // Placed after the salary column for logical grouping.
            $table->string('currency', 3)->after('salary_in_local_currency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_details', function (Blueprint $table) {
            $table->dropColumn('currency');
        });
    }
};
