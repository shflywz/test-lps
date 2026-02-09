<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KategoriBuku extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kategori = [
            ['kategori' => 'Pendidikan'],
            ['kategori' => 'Olahraga'],
            ['kategori' => 'Anak'],
            ['kategori' => 'Teknologi'],
        ];
        DB::table('kategori_buku')->insert($kategori);
    }
}
