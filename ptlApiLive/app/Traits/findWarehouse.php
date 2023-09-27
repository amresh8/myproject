<?php
namespace App\Traits;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Traits\UserWarehousesTrait;


trait findWarehouse
{

    public function findWarehouseCode($wcode)
    {
        $whQuery = DB::table('tbl_WHCustmapping')
            ->where([['CUSTID', Auth::user()->userid], ['CLIENTUUID', $wcode]])
            ->lock('WITH(NOLOCK)')->get();

        $countWh = count($whQuery);
        if ($countWh > 0) {
            $whid = $whQuery[0]->WHID;
            return $whid;
        } else {

            return 'notfound';
        }
    }
}