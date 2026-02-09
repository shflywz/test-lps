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
        Schema::create('master_submenu', function (Blueprint $table) {
            $table->unsignedInteger('msid')->autoIncrement();
            $table->primary('msid');
            $table->unsignedInteger('mmid');
            $table->unsignedInteger('msid_parent')->nullable()->comment('Parent submenu (self reference)');
            $table->string('name');
            $table->string('icon')->nullable();
            $table->enum('link_type', ['route', 'url'])->default('route');
            $table->string('route_name')->nullable();
            $table->string('url')->nullable();
            $table->string('target', 20)->default('_self');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_expandable')->default(false)->comment('Apakah submenu punya child');
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('created_time')->useCurrent();

            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamp('updated_time')->useCurrent()->useCurrentOnUpdate();

            $table->unsignedInteger('deleted_by')->nullable();
            $table->timestamp('deleted_time')->nullable();

            $table->index(['mmid', 'msid_parent']);
            $table->index(['name', 'is_active']);
            $table->index(['sort_order']);

            $table->foreign('mmid')->references('mmid')->on('master_menu')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_submenu');
    }
};
