<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\MainController;
use App\Http\Controllers\MasterMenuController;
use App\Http\Controllers\MasterBuku;
use App\Http\Controllers\Jawaban;

Route::get('/', function () {
    return redirect()->route('login');
    // return Inertia::render('welcome', [
    //     'canRegister' => Features::enabled(Features::registration()),
    // ]);
})->name('home');

// Route::get('dashboard', function () {
//     return Inertia::render('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Landing
    Route::get('/dashboard', [MainController::class, 'index'])->name('dashboard');

    // Master Menu
    Route::get('/master_main_menu', [MasterMenuController::class, 'main_menu'])->name('main_menu');
    Route::get('/list_menu', [MasterMenuController::class, 'list_main_menu'])->name('list_main_menu');
    Route::post('/master_main_menu/store', [MasterMenuController::class, 'main_menu_store'])->name('main_menu.store');
    Route::delete('/master_main_menu/delete/{id}', [MasterMenuController::class, 'main_menu_delete'])->name('main_menu.delete');
    Route::put('/master_main_menu/update/{id}', [MasterMenuController::class, 'main_menu_update'])->name('main_menu.update');
    Route::get('/master_main_menu/detail_main_menu/{id}', [MasterMenuController::class, 'main_menu_detail'])->name('main_menu.detail');
    
    Route::get('/master_sub_menu', [MasterMenuController::class, 'sub_menu'])->name('sub_menu');
    Route::get('/list_submenu', [MasterMenuController::class, 'list_sub_menu'])->name('list_sub_menu');
    Route::get('/master_submenu/detail_submenu/{id}', [MasterMenuController::class, 'submenu_detail'])->name('submenu.detail');
    Route::put('/master_submenu/update/{id}', [MasterMenuController::class, 'submenu_update'])->name('submenu.update');
    
    Route::get('/master_grand_menu', [MasterMenuController::class, 'grand_menu'])->name('grand_menu');
    
    Route::get('/master_buku', [MasterBuku::class, 'index'])->name('master_buku');
    Route::get('/list_buku', [MasterBuku::class, 'list_buku'])->name('list_buku');
    Route::get('/jenis_buku', [MasterBuku::class, 'jenis_buku'])->name('jenis_buku');
    Route::post('/master_buku/store', [MasterBuku::class, 'master_buku_store'])->name('master_buku.store');
    Route::get('/master_buku/detail_buku/{id}', [MasterBuku::class, 'detail_buku'])->name('buku.detail');
    Route::put('/master_buku/update/{id}', [MasterBuku::class, 'buku_update'])->name('master_buku.update');

    Route::get('/jawaban4', [Jawaban::class, 'jawaban4'])->name('jawaban4');
    Route::get('/jawaban5', [Jawaban::class, 'jawaban5'])->name('jawaban5');
});

require __DIR__.'/settings.php';
