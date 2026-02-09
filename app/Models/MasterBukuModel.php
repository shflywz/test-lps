<?php

namespace App\Models;

use CommonHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MasterBukuModel extends Model
{
    public function list_buku(Request $request, $filters = null)
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $data = $request->query();
        $addSQL = '';
        $bindings = []; 

        if ($data['sjudul'] ?? null) {
            $addSQL .= " AND a.judul ILIKE ?";
            $bindings[] = '%'.$data['sjudul'].'%';
        }
        if ($data['spenulis'] ?? null) {
            $addSQL .= " AND a.penulis ILIKE ?";
            $bindings[] = '%'.$data['spenulis'].'%';
        }
        if ($data['sstatus'] ?? null) {
            $addSQL .= " AND a.is_active = ?";
            $bindings[] = $data['sstatus'];
        }
        if ($data['sjenis'] ?? null) {
            $addSQL .= " AND a.jenis_buku = ?";
            $bindings[] = $data['sjenis'];
        }

        $query = "SELECT 
                        a.*, b.kategori
                    FROM jenis_buku a 
                    LEFT JOIN kategori_buku b ON b.kbid = a.jenis_buku
                    WHERE TRUE $addSQL";

        return CommonHelper::getAll($query, $bindings);
    }

    public function buku_store(Request $request)
    {
        // if(Auth::user()->id == 1) CommonHelper::enab leDebug(true);

        $query = "INSERT INTO jenis_buku (judul, penulis, jenis_buku, tanggal_rilis, jumlah_halaman, is_active) VALUES (?, ?, ?, ?, ?, ?)";
        $bindings = [
            $request->judul,
            $request->penulis,
            4,
            $request->rilis,
            $request->jumlah,
            $request->is_active ? 1 : 0
        ];

        $id = CommonHelper::getInsert($query, $bindings);
        $buku = CommonHelper::getOne("SELECT * FROM jenis_buku WHERE jbid = ?", [$id]);

        return $buku;
    }

    public function get_detail_buku($id)
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $bindings = [$id]; 

        $query = "SELECT 
                        a.*
                    FROM jenis_buku a 
                    WHERE a.jbid = ?";

        return CommonHelper::getAll($query, $bindings);
    }

    public function jenis_buku()
    {
        // if(Auth::user()->id == 1) CommonHelper::enableDebug(true);

        $query = "SELECT a.kbid, a.kategori FROM kategori_buku a";

        return CommonHelper::getAll($query);
    }

    public function buku_update($id, $request)
    {
        $query = "UPDATE jenis_buku 
                  SET judul = ?, penulis = ?, jenis_buku = ?, updated_time = NOW(), is_active = ?, tanggal_rilis = ?, jumlah_halaman = ?
                  WHERE jbid = ?";

        $bindings = [
            $request->judul,
            $request->penulis,
            $request->jenis_buku,
            $request->is_active ? 1 : 0,
            $request->rilis,
            $request->jumlah,
            $id
        ];

        CommonHelper::getUpdate($query, $bindings);

        $selectQuery = "SELECT * FROM jenis_buku WHERE jbid = ?";
        return CommonHelper::getOne($selectQuery, [$id]);
    }
}
