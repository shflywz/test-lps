<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MasterMenuModel;
use Illuminate\Support\Facades\Validator;

class MasterMenuController extends Controller
{
    protected MasterMenuModel $model;

    public function __construct()
    {
        $this->model = new MasterMenuModel();
    }

    function main_menu()
    {
        return Inertia::render('master_menu/list_main_menu');
    }

    public function list_main_menu(Request $request)
    {
        $resMenu = $this->model->list_main_menu($request);

        $total = count($resMenu);
        $no = 1;

        $data = array_map(function ($menu) use (&$no) {
            return [
                'no' => $no++,
                'mmid' => $menu->mmid,
                'name' => $menu->name,
                'icon' => $menu->icon,
                'route_name' => $menu->route_name,
                'url' => $menu->url,
                'target' => $menu->target,
                'sort_order' => $menu->sort_order,
                'is_active' => $menu->is_active,
                'is_expandable' => $menu->is_expandable,
                'submenus' => [],
            ];
        }, $resMenu);

        return response()->json([
            'data' => $data,
            'total' => $total,
        ]);
    }

    public function main_menu_store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $setInsert = $this->model->main_menu_store($request);

            return response()->json([
                'message' => 'Menu berhasil dibuat',
                'data' => $setInsert
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan menu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function main_menu_delete($id)
    {
        try {
            $deleted = $this->model->main_menu_delete($id);

            if ($deleted) {
                return response()->json([
                    'message' => 'Menu berhasil dihapus'
                ], 200);
            }

            return response()->json([
                'message' => 'Menu tidak ditemukan'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus menu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function main_menu_update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $menu = $this->model->main_menu_update($id, $request);

            return response()->json([
                'message' => 'Menu berhasil diperbarui',
                'data' => $menu
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui menu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function main_menu_detail($id)
    {
        $detailMenu = $this->model->get_detail_main_menu($id);

        $data = array_map(function ($detailMenu) {
            return [
                'mmid' => $detailMenu->mmid,
                'name' => $detailMenu->name,
                'icon' => $detailMenu->icon,
                'route_name' => $detailMenu->route_name,
                'url' => $detailMenu->url,
                'target' => $detailMenu->target,
                'sort_order' => $detailMenu->sort_order,
                'is_active' => $detailMenu->is_active,
                'is_expandable' => $detailMenu->is_expandable,
                'submenus' => [],
            ];
        }, $detailMenu);

        return response()->json([
            'data' => $data[0],
        ]);
    }

    function sub_menu()
    {
        return Inertia::render('master_menu/list_submenu');
    }

    public function list_sub_menu(Request $request)
    {
        $resSubMenu = $this->model->list_sub_menu($request);
        $total = count($resSubMenu);
        $no = 1;

        $data = array_map(function ($submenu) use (&$no) {
            return [
                'no' => $no++,
                'msid' => $submenu->msid,
                'mmid' => $submenu->mmid,
                'msid_parent' => $submenu->msid_parent,
                'name' => $submenu->name,
                'route_name' => $submenu->route_name,
                'is_active' => $submenu->is_active,
                'is_expandable' => $submenu->is_expandable,
            ];
        }, $resSubMenu);

        return response()->json([
            'data' => $data,
            'total' => $total,
        ]);
    }

    public function submenu_detail($id)
    {
        $detailMenu = $this->model->get_detail_submenu($id);

        $data = array_map(function ($detailMenu) {
            return [
                'msid' => $detailMenu->msid,
                'mmid' => $detailMenu->mmid,
                'name' => $detailMenu->name,
                'icon' => $detailMenu->icon,
                'route_name' => $detailMenu->route_name,
                'url' => $detailMenu->url,
                'target' => $detailMenu->target,
                'sort_order' => $detailMenu->sort_order,
                'is_active' => $detailMenu->is_active,
                'is_expandable' => $detailMenu->is_expandable,
            ];
        }, $detailMenu);

        return response()->json([
            'data' => $data[0],
        ]);
    }

    public function submenu_update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $menu = $this->model->submenu_update($id, $request);

            return response()->json([
                'message' => 'Menu berhasil diperbarui',
                'data' => $menu
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui menu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    function grand_menu()
    {
        return Inertia::render('dashboard');
    }
}
