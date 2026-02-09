<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class insert_menu extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Master Menu
        DB::table('master_menu')->insert([
            [
                'mmid' => 1,
                'name' => 'Dashboard',
                'icon' => 'LayoutGrid',
                'route_name' => 'dashboard',
                'url' => null,
                'target' => '_self',
                'sort_order' => 1,
                'is_active' => true,
                'is_expandable' => false,
                'created_by' => null,
                'created_time' => '2026-02-06 00:18:25',
                'updated_by' => null,
                'updated_time' => null,
                'deleted_by' => null,
                'deleted_time' => null,
            ],
            [
                'mmid' => 2,
                'name' => 'Master Data',
                'icon' => 'Database',
                'route_name' => null,
                'url' => null,
                'target' => '_self',
                'sort_order' => 2,
                'is_active' => true,
                'is_expandable' => true,
                'created_by' => null,
                'created_time' => '2026-02-06 00:18:52',
                'updated_by' => null,
                'updated_time' => null,
                'deleted_by' => null,
                'deleted_time' => null,
            ],
        ]);

        // Master Submenu
        DB::table('master_submenu')->insert([
            [
                'msid' => 3,
                'mmid' => 2,
                'msid_parent' => 2,
                'name' => 'Main Menu',
                'icon' => '',
                'link_type' => 'route',
                'route_name' => 'master_main_menu',
                'url' => null,
                'target' => '_self',
                'sort_order' => 1,
                'is_active' => true,
                'is_expandable' => false,
                'created_by' => null,
                'created_time' => '2026-02-06 00:22:51',
                'updated_by' => null,
                'updated_time' => '2026-02-06 00:22:51',
                'deleted_by' => null,
                'deleted_time' => null,
            ],
            [
                'msid' => 4,
                'mmid' => 2,
                'msid_parent' => 2,
                'name' => 'Sub Menu',
                'icon' => null,
                'link_type' => 'route',
                'route_name' => 'master_sub_menu',
                'url' => null,
                'target' => '_self',
                'sort_order' => 2,
                'is_active' => true,
                'is_expandable' => false,
                'created_by' => null,
                'created_time' => '2026-02-06 00:22:51',
                'updated_by' => null,
                'updated_time' => '2026-02-06 00:22:51',
                'deleted_by' => null,
                'deleted_time' => null,
            ],
            [
                'msid' => 5,
                'mmid' => 2,
                'msid_parent' => 2,
                'name' => 'Grand Menu',
                'icon' => null,
                'link_type' => 'route',
                'route_name' => 'master_grand_menu',
                'url' => null,
                'target' => '_self',
                'sort_order' => 3,
                'is_active' => true,
                'is_expandable' => false,
                'created_by' => null,
                'created_time' => '2026-02-06 00:22:51',
                'updated_by' => null,
                'updated_time' => '2026-02-06 00:22:51',
                'deleted_by' => null,
                'deleted_time' => null,
            ],
            [
                'msid' => 2,
                'mmid' => 2,
                'msid_parent' => null,
                'name' => 'Menu',
                'icon' => null,
                'link_type' => 'route',
                'route_name' => 'master_menu',
                'url' => null,
                'target' => '_self',
                'sort_order' => 2,
                'is_active' => true,
                'is_expandable' => true,
                'created_by' => null,
                'created_time' => '2026-02-06 00:20:19',
                'updated_by' => null,
                'updated_time' => '2026-02-06 00:20:19',
                'deleted_by' => null,
                'deleted_time' => null,
            ],
            [
                'msid' => 1,
                'mmid' => 2,
                'msid_parent' => null,
                'name' => 'Buku',
                'icon' => null,
                'link_type' => 'route',
                'route_name' => 'master_buku',
                'url' => null,
                'target' => '_self',
                'sort_order' => 1,
                'is_active' => true,
                'is_expandable' => false,
                'created_by' => null,
                'created_time' => '2026-02-06 00:19:51',
                'updated_by' => null,
                'updated_time' => '2026-02-06 09:47:42',
                'deleted_by' => null,
                'deleted_time' => null,
            ],
        ]);
    }
}
