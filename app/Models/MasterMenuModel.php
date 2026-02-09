<?php

namespace App\Models;

use CommonHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MasterMenuModel extends Model
{
    public function list_main_menu(Request $request)
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $data = $request->query();
        $addSQL = '';
        $bindings = []; 

        if ($data['name']) {
            $addSQL .= " AND a.name ILIKE ?";
            $bindings[] = '%'.$data['name'].'%';
        }
        if ($data['category']) {
            $addSQL .= " AND a.is_active = ?";
            $bindings[] = $data['category'];
        }

        $query = "SELECT 
                        a.*
                    FROM master_menu a 
                    WHERE TRUE $addSQL";

        return CommonHelper::getAll($query, $bindings);
    }

    public function main_menu_store(Request $request)
    {
        if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $query = "INSERT INTO master_menu (name, icon, is_active, route_name) VALUES (?, ?, ?, ?)";
        $bindings = [
            $request->name,
            $request->icon,
            $request->is_active ? 1 : 0,
            $request->route_name,
        ];

        $id = CommonHelper::getInsert($query, $bindings);
        $menu = CommonHelper::getOne("SELECT * FROM master_menu WHERE mmid = ?", [$id]);

        return $menu;
    }

    public function main_menu_delete($id)
    {
        $query = "DELETE FROM master_menu WHERE mmid = ?";
        return CommonHelper::setDelete($query, [$id]);
    }

    public function main_menu_update(int $id, Request $request)
    {
        $query = "UPDATE master_menu 
                  SET name = ?, icon = ?, is_active = ?, updated_time = NOW(), route_name = ?
                  WHERE mmid = ?";

        $bindings = [
            $request->name,
            $request->icon,
            $request->is_active ? 1 : 0,
            $request->route_name,
            $id
        ];

        CommonHelper::getUpdate($query, $bindings);

        $selectQuery = "SELECT * FROM master_menu WHERE mmid = ?";
        return CommonHelper::getOne($selectQuery, [$id]);
    }

    public function get_detail_main_menu($id)
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $bindings = [$id]; 

        $query = "SELECT 
                        a.*
                    FROM master_menu a 
                    WHERE a.mmid = ?";

        return CommonHelper::getAll($query, $bindings);
    }

    public function list_sub_menu(Request $request)
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $data = $request->query();
        $addSQL = '';
        $bindings = []; 

        if ($data['name']) {
            $addSQL .= " AND a.name ILIKE ?";
            $bindings[] = '%'.$data['name'].'%';
        }
        if ($data['category']) {
            $addSQL .= " AND a.is_active = ?";
            $bindings[] = $data['category'];
        }

        $query = "SELECT 
                        a.*
                    FROM master_submenu a 
                    WHERE TRUE $addSQL";

        return CommonHelper::getAll($query, $bindings);
    }

    public function get_detail_submenu($id)
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $bindings = [$id]; 

        $query = "SELECT 
                        a.*
                    FROM master_submenu a 
                    WHERE a.msid = ?";

        return CommonHelper::getAll($query, $bindings);
    }

    public function submenu_update($id, Request $request)
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $query = "UPDATE master_submenu 
                  SET name = ?, is_active = ?, updated_time = NOW(), route_name = ?
                  WHERE msid = ?";

        $bindings = [
            $request->name,
            $request->is_active ? 1 : 0,
            $request->route_name,
            $id
        ];

        CommonHelper::getUpdate($query, $bindings);

        $selectQuery = "SELECT * FROM master_submenu WHERE msid = ?";
        return CommonHelper::getOne($selectQuery, [$id]);
    }
}
