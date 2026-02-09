<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use App\Models\CommonModel;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $resMenu = CommonModel::getMenus();
        $groupedMenus = [];
        $submenusFlat = [];

        foreach ($resMenu as $row) {
            $mmid = $row->mmid;
            $msid = $row->msid;
            $msidParent = $row->msid_parent;

            // --- Menu Utama ---
            if (!isset($groupedMenus[$mmid])) {
                $groupedMenus[$mmid] = [
                    'id' => $mmid,
                    'name' => $row->menu,
                    'icon' => $row->icon_menu,
                    'route' => $row->route_menu,
                    'url' => $row->url_menu,
                    'target' => $row->target_menu,
                    'expandable' => $row->expand_menu,
                    'submenus' => []
                ];
            }

            // --- Submenu ---
            if ($msid) {
                $submenusFlat[$msid] = [
                    'id' => $msid,
                    'name' => $row->submenu,
                    'icon' => $row->icon_submenu,
                    'type' => $row->type_submenu,
                    'route' => $row->route_submenu,
                    'url' => $row->url_submenu,
                    'target' => $row->target_submenu,
                    'expandable' => $row->expand_submenu,
                    'children' => [],
                    'parent' => $msidParent,  // simpan parent untuk nanti
                    'mmid' => $mmid,          // simpan mmid untuk assign ke menu utama
                ];
            }
        }

        // --- Assign submenus ke parent (rekursif) ---
        foreach ($submenusFlat as $id => $submenu) {
            if ($submenu['parent']) {
                $parentId = $submenu['parent'];

                // Jika parent belum ada, buat placeholder
                if (!isset($submenusFlat[$parentId])) {
                    $submenusFlat[$parentId] = [
                        'id' => $parentId,
                        'name' => 'Unknown',
                        'icon' => null,
                        'type' => null,
                        'route' => null,
                        'url' => null,
                        'target' => '_self',
                        'expandable' => false,
                        'children' => [],
                        'parent' => null,
                        'mmid' => $submenu['mmid'],
                    ];
                }

                $submenusFlat[$parentId]['children'][] = &$submenusFlat[$id];
            }
        }

        // --- Assign top-level submenus ke main menu ---
        foreach ($submenusFlat as $id => $submenu) {
            if ($submenu['parent'] === null) {
                $mmid = $submenu['mmid'];
                $groupedMenus[$mmid]['submenus'][] = $submenu;
            }
        }

        // --- Reindex main menu & submenus agar numeric ---
        foreach ($groupedMenus as &$menu) {
            $menu['submenus'] = array_values($menu['submenus']);
        }
        $groupedMenus = array_values($groupedMenus);
        Inertia::share('mainNavItems', $groupedMenus);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null
        );
    }
}
