<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Jawaban extends Controller
{
    public function jawaban4()
    {
        $data = "hello world";
        $data = str_replace(' ', '', $data);

        $arrHuruf = [];
        for ($i = 0; $i < strlen($data); $i++) {
            if (isset($arrHuruf[$data[$i]])) {
                $arrHuruf[$data[$i]]++;
            } else {
                $arrHuruf[$data[$i]] = 1;
            }
        }

        foreach ($arrHuruf as $huruf => $total) {
            echo $huruf . " – " . $total . "<br>";
        }
    }

    public function jawaban5()
    {
        $N = 10;

        for ($i = 1; $i <= $N; $i++) {
            if ($i % 5 == 0 && $i != 5) {
                echo "IDIC ";
            } elseif ($i % 6 == 0 && $i != 6) {
                echo "LPS ";
            } else {
                echo $i . " ";
            }
        }
    }
}
