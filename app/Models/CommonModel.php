<?php

namespace App\Models;

use CommonHelper;
use Illuminate\Support\Facades\Auth;

class CommonModel
{
    public static function getMenus()
    {
        // if(Auth::user()->uaid == 1) CommonHelper::enableDebug(true);

        $query = "SELECT 
                        a.mmid, a.name as menu, a.icon as icon_menu, a.route_name as route_menu, a.url as url_menu, a.target as target_menu, a.is_expandable as expand_menu,
                        b.msid, msid_parent, b.name as submenu, b.icon as icon_submenu, b.link_type as type_submenu, b.route_name as route_submenu, b.url as url_submenu, b.target as target_submenu, b.is_expandable as expand_submenu
                    FROM master_menu a 
                    LEFT JOIN master_submenu b ON b.mmid = a.mmid AND b.is_active IS TRUE
                    WHERE a.is_active IS TRUE
                    ORDER BY a.sort_order, b.sort_order ASC";
        $bindings = []; 

        return CommonHelper::getAll($query, $bindings);
    }

}// END OF CLASS