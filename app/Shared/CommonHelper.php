<?php

namespace App\Shared;

use Illuminate\Support\Facades\DB;

class CommonHelper
{
    /**
     * Debug global: jika true, semua query akan dicetak otomatis.
     */
    public static bool $debug = false;

    /**
     * Aktifkan atau matikan debug global.
     */
    public static function enableDebug(bool $enable = true): void
    {
        self::$debug = $enable;
    }

    /**
     * Debug SQL query dengan bindings, output HTML modern.
     *
     * @param string $query
     * @param array $bindings
     * @return string
     */
    public static function sqlDebug(string $query, array $bindings = []): string
    {
        $displayQuery = $query;

        // Replace placeholder ? dengan binding, tapi query tetap utuh
        if (!empty($bindings)) {
            $i = 0;
            $displayQuery = preg_replace_callback('/\?/', function ($matches) use ($bindings, &$i) {
                $b = $bindings[$i] ?? '';
                $i++;
                if (is_bool($b)) return $b ? 'TRUE' : 'FALSE';
                if ($b === null) return 'NULL';
                if (is_string($b)) return "'" . addslashes($b) . "'";
                return $b;
            }, $displayQuery);
        }

        // Line break di keyword SQL
        $pattern = '/\b(SELECT|FROM|LEFT JOIN|RIGHT JOIN|INNER JOIN|WHERE|ORDER BY|GROUP BY|HAVING|LIMIT|ON|AND|OR|AS)\b/i';
        $displayQuery = preg_replace($pattern, "\n$1", $displayQuery);
        $displayQuery = trim($displayQuery);

        // Bindings HTML
        $bindingsHtml = '';
        if (!empty($bindings)) {
            $bindingsHtml .= "<div class='sql-bindings'><strong>Bindings:</strong><br>";
            foreach ($bindings as $i => $b) {
                $bindingsHtml .= "  [$i] => " . htmlspecialchars((string)$b) . "<br>";
            }
            $bindingsHtml .= "</div>";
        }

        return <<<HTML
            <div style="
                background:#f0f2f5;
                padding:16px;
                border-radius:12px;
                box-shadow:0 4px 12px rgba(0,0,0,0.12);
                font-family: 'SF Mono', 'Menlo', monospace;
                font-size:14px;
                line-height:1.5;
                overflow:auto;
                color:#1c1e21;
                word-wrap:break-word;
            ">
            <div style="font-weight:bold;margin-bottom:8px;color:#007aff;">DEBUG :</div>
            <pre style="margin:0;">$displayQuery</pre>
            $bindingsHtml
            </div>
            HTML;
    }

    /**
     * Ambil semua data dari query.
     *
     * @param string $query
     * @param array $bindings
     * @return array
     */
    public static function getAll(string $query, array $bindings = []): array
    {
        if (self::$debug) {
            echo self::sqlDebug($query, $bindings);
        }

        return DB::select($query, $bindings);
    }

    /**
     * Ambil satu baris dari query.
     *
     * @param string $query
     * @param array $bindings
     * @return object|null
     */
    public static function getOne(string $query, array $bindings = [])
    {
        if (self::$debug) {
            echo self::sqlDebug($query, $bindings);
        }

        $result = DB::select($query, $bindings);
        return $result[0] ?? null;
    }

    public static function getInsert(string $query, array $bindings = []): int
    {
        if (self::$debug) echo self::sqlDebug($query, $bindings);
        DB::insert($query, $bindings);
        return DB::getPdo()->lastInsertId();
    }

    public static function getUpdate(string $query, array $bindings = []): int
    {
        if (self::$debug) echo self::sqlDebug($query, $bindings);
        return DB::update($query, $bindings);
    }

    public static function setDelete(string $query, array $bindings = []): int
    {
        if (self::$debug) echo self::sqlDebug($query, $bindings);
        return DB::delete($query, $bindings);
    }
}
