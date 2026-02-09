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
        Schema::create('master_menu', function (Blueprint $table) {
            $table->unsignedInteger('mmid')->autoIncrement();
            $table->primary('mmid');
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('route_name')->nullable()->comment('Nama route Laravel untuk menu utama');
            $table->string('url')->nullable()->comment('URL manual jika tidak menggunakan route_name');
            $table->string('target', 20)->default('_self')->comment('_self | _blank');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_expandable')->default(true)->comment('Apakah menu memiliki submenu');
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('created_time')->useCurrent();

            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamp('updated_time')->nullable();

            // Soft delete (custom)
            $table->unsignedInteger('deleted_by')->nullable();
            $table->timestamp('deleted_time')->nullable();

            $table->index(['name', 'is_active']);
            $table->index(['sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_menu');
    }
};
