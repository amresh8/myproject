<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use DB;
use Auth;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use App\Traits\findWarehouse;
use Illuminate\Support\Str;
use App\Http\Requests\BoxClouserSortRequest;

class BoxClouserSortController extends Controller
{
    use findWarehouse;

    // public function boxClouserSortMethodd(BoxClouserSortRequest $request)
    public function boxClouserSortMethodd(BoxClouserSortRequest $request)
    {
        $data = $this->findWarehouseCode($request->WhCode);
        if ($data == "notfound") {
            return response()->json([
                'errors' => 'WHCode not exist!'
            ], 404);
        } else {
            $whid = $data;
        }


        $validateNumRow = "SELECT crateno FROM Tbl_CrateSortData with(nolock) where wh='" . $whid . "'
         and custid='" . Auth::user()->userid . "' and crateno='" . $request->BoxNo . "' group by crateno";
        $numRow = DB::select($validateNumRow);
        $countValue = count($numRow);
        if ($countValue > 0) {
            return response()->json([
                'errors' => 'Box already exist in database.'
            ], 404);

        } else {

            $recursiveIncSortInsert = 1;
            $itemsValues = $request->ITEMS;
            $this->insertSortMethod(
                $whid,
                Auth::user()->userid,
                $request->Sku,
                $request->ShortQty,
                $request->BoxNo,
                $recursiveIncSortInsert,
                $itemsValues,
                $request->OrderBatchNo
            );

            return response()->json([
                'success' => 'Box Sort Clouser Successfully Updated.'
            ], 200);

        }
    }

    public function insertSortMethod(
        $whid,
        $userid,
        $Sku,
        $ShortQty,
        $BoxNo,
        $recursiveIncSortInsert,
        $itemsValues,
        $OrderBatchNo
    ) {
        $totalItems = count($itemsValues);
        for ($i = 0; $i < $totalItems; $i++) {
            $insertsort = "INSERT INTO Tbl_CrateSortData WITH(TABLOCK) (WH,CUSTID,SKU,QTY,Crateno,CrateSortby,CrateSortOn,orderbatchno)VALUES('" . $whid . "','" . $userid . "','" . $itemsValues[$i]['Sku'] . "','" . $itemsValues[$i]['ShortQty'] . "','" . $BoxNo . "','api',GETDATE(),'" . $OrderBatchNo . "')";
            $inserted = DB::insert($insertsort);
        }
        return true;


    }
}