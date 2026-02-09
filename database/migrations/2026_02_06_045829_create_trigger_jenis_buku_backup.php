<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared("
            CREATE OR REPLACE FUNCTION trg_before_update_jenis_buku_fn()
            RETURNS trigger
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_user_id INTEGER;
            BEGIN
                -- ambil user dari session
                BEGIN
                    v_user_id := current_setting('app.current_user_id')::INTEGER;
                EXCEPTION
                    WHEN others THEN
                        v_user_id := NULL;
                END;

                INSERT INTO jenis_buku_b (
                    backup_by,
                    backup_time,
                    jbid,
                    judul,
                    penulis,
                    jenis_buku,
                    is_active,
                    tanggal_rilis,
                    jumlah_halaman,
                    created_by,
                    created_time,
                    updated_by,
                    updated_time,
                    deleted_by,
                    deleted_time
                )
                VALUES (
                    v_user_id,
                    NOW(),
                    OLD.jbid,
                    OLD.judul,
                    OLD.penulis,
                    OLD.jenis_buku,
                    OLD.is_active,
                    OLD.tanggal_rilis,
                    OLD.jumlah_halaman,
                    OLD.created_by,
                    OLD.created_time,
                    OLD.updated_by,
                    OLD.updated_time,
                    OLD.deleted_by,
                    OLD.deleted_time
                );

                RETURN NEW;
            END;
            $$;

            DROP TRIGGER IF EXISTS trg_before_update_jenis_buku ON jenis_buku;

            CREATE TRIGGER trg_before_update_jenis_buku
            BEFORE UPDATE ON jenis_buku
            FOR EACH ROW
            EXECUTE FUNCTION trg_before_update_jenis_buku_fn();
        ");
    }

    public function down(): void
    {
        DB::unprepared("
            DROP TRIGGER IF EXISTS trg_before_update_jenis_buku ON jenis_buku;
            DROP FUNCTION IF EXISTS trg_before_update_jenis_buku_fn();
        ");
    }
};
