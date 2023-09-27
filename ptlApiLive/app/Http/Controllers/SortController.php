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
use App\Http\Requests\SortUpdateRequest;
use App\Models\Sort;

class SortController extends Controller
{
    use findWarehouse;
    public function sortMethod(SortUpdateRequest $request)
    {

        $data = $this->findWarehouseCode($request->WhCode);
        if ($data == "notfound") {
            return response()->json([
                'errors' => 'WHCode not exist!'
            ], 404);
        } else {
            $whid = $data;
        }
        date_default_timezone_set('Asia/Kolkata');
        $entryDate = date('Y-m-d h:i:s');


        $validateBoxNumber = "SELECT distinct boxno FROM tbl_PTLSORTDATA with(nolock) where wh='" . $whid . "' and custid='" . Auth::user()->userid . "' and boxno='" . $request->BoxNumber . "'";
        $validateData = DB::select($validateBoxNumber);

        $count = count($validateData);
        if ($count > 0) {
            return response()->json(['errors' => 'Box Number already exists in database!'], 404);
        } else {

            $items = $request->ITEMS;
            $userid = Auth::user()->userid;
            $StoreCode = $request->StoreCode;
            $BoxNumber = $request->BoxNumber;
            $Weight = $request->Weight;
            $OrderBatchNo = $request->OrderBatchNo;
            $WorkingArray = json_decode(json_encode($items), true);
            $arr = collect($WorkingArray)
                ->map(function ($item) use ($whid, $userid, $StoreCode, $BoxNumber, $Weight, $OrderBatchNo, $entryDate) {
                    $item['WH'] = $whid;
                    $item['CUSTID'] = $userid;
                    $item['StoreCode'] = $StoreCode;
                    $item['BoxNumber'] = $BoxNumber;
                    $item['Weight'] = $Weight;
                    $item['OrderBatchNo'] = $OrderBatchNo;
                    $item['EntryOn'] = $entryDate;
                    return $item;
                });

            $valuesfinal = $arr->map(function ($arrval) {
                $arrval['REF_NO'] = $arrval['SalesOrderNo'];
                $arrval['DN_NO'] = $arrval['DnNo'];
                $arrval['BOXNO'] = $arrval['BoxNumber'];
                unset($arrval['SalesOrderNo']);
                unset($arrval['DnNo']);
                unset($arrval['BoxNumber']);
                return $arrval;

            })->toArray();
            // return response($valuesfinal);
            $queryResult = Sort::insert($valuesfinal);
            if ($queryResult > 0) {
                return response()->json(['success' => 'Data Inserted Successfully.'], 200);
            } else {
                return response()->json(['errors' => 'There is some problem. Please try again.'], 404);
            }
        }
    }
}