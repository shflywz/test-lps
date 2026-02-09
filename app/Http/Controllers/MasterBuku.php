<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MasterBukuModel;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;

class MasterBuku extends Controller
{
    protected MasterBukuModel $model;

    public function __construct()
    {
        $this->model = new MasterBukuModel();
    }

    public function index()
    {
        return Inertia::render('master_buku/master_buku');
    }

    public function list_buku(Request $request)
    {
        $resBuku = $this->model->list_buku($request);

        $total = count($resBuku);
        $no = 1;

        $data = array_map(function ($buku) use (&$no) {
            return [
                'no' => $no++,
                'jbid' => $buku->jbid,
                'judul' => $buku->judul,
                'penulis' => $buku->penulis,
                'jenis_buku' => $buku->jenis_buku,
                'is_active' => $buku->is_active,
                'tanggal_rilis' => date('d-m-Y', strtotime($buku->tanggal_rilis)),
                'jumlah_halaman' => $buku->jumlah_halaman,
                'kategori' => $buku->kategori,
            ];
        }, $resBuku);

        return response()->json([
            'data' => $data,
            'total' => $total,
        ]);
    }

    public function master_buku_store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:100',
            'penulis' => 'required|string|max:100',
            'jumlah' => 'required|integer',
            'rilis' => 'required|date',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $setInsert = $this->model->buku_store($request);

            return response()->json([
                'message' => 'Buku berhasil dibuat',
                'data' => $setInsert
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menyimpan menu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function detail_buku($id)
    {
        $detailBuku = $this->model->get_detail_buku($id);

        $data = array_map(function ($detailBuku) {
            return [
                'jbid' => $detailBuku->jbid,
                'judul' => $detailBuku->judul,
                'penulis' => $detailBuku->penulis,
                'jenis_buku' => $detailBuku->jenis_buku,
                'tanggal_rilis' => $detailBuku->tanggal_rilis,
                'jumlah_halaman' => $detailBuku->jumlah_halaman,
                'is_active' => $detailBuku->is_active,
            ];
        }, $detailBuku);

        return response()->json([
            'data' => $data[0],
        ]);
    }

    public function jenis_buku()
    {
        $resJenisBuku = $this->model->jenis_buku();

        $total = count($resJenisBuku);
        $no = 1;

        $data = array_map(function ($jenisBuku) use (&$no) {
            return [
                'kbid' => $jenisBuku->kbid,
                'kategori' => $jenisBuku->kategori,
            ];
        }, $resJenisBuku);

        return response()->json([
            'data' => $data,
            'total' => $total,
        ]);
    }

    public function buku_update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:100',
            'penulis' => 'required|string|max:100',
            'jumlah' => 'required|integer',
            'rilis' => 'required|date',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $menu = $this->model->buku_update($id, $request);

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

}
