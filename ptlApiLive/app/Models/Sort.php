<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sort extends Model
{
    use HasFactory;
    protected $table = "tbl_ptlsortdata";
    protected $guarded = [];
    // protected $fillalble =
    //     [
    //         'WH',
    //         'CUSTID',
    //         'ORDERBATCHNO',
    //         'BOXNO',
    //         'REF_NO',
    //         'DN_NO',
    //         'LINEITEM',
    //         'SKU',
    //         'QTY',
    //         'STORECODE',
    //         'WEIGHT'
    //     ];

}