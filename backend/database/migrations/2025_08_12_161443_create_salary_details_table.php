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
        Schema::create('salary_details', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique(); // Ensures email is unique at DB level
            $table->decimal('salary_in_local_currency', 10, 2);
            $table->decimal('salary_in_euros', 10, 2)->nullable();
            $table->decimal('commission', 10, 2)->default(500.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_details');
    }
};
