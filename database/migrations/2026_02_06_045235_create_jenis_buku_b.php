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
        Schema::create('jenis_buku_b', function (Blueprint $table) {
            $table->unsignedInteger('jbbid')->autoIncrement();
            $table->primary('jbbid');
            $table->unsignedInteger('backup_by');
            $table->timestamp('backup_time');
            $table->unsignedInteger('jbid');
            $table->string('judul', 100);
            $table->string('penulis', 100);
            $table->unsignedInteger('jenis_buku')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('tanggal_rilis')->nullable();
            $table->unsignedInteger('jumlah_halaman')->nullable();
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('created_time')->useCurrent();

            $table->unsignedInteger('updated_by')->nullable();
            $table->timestamp('updated_time')->nullable();

            $table->unsignedInteger('deleted_by')->nullable();
            $table->timestamp('deleted_time')->nullable();

            $table->index(['judul', 'is_active']);
            $table->index(['penulis', 'jenis_buku']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jenis_buku_b');
    }
};
