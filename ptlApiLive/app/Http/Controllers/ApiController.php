<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use DB;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Auth;
use App\Traits\findWarehouse;
use Illuminate\Support\Str;
use App\Http\Requests\ApiUpdateRequest;

class ApiController extends Controller
{
    use findWarehouse;
    public function crateClourser(ApiUpdateRequest $request)
    {

        $data = $this->findWarehouseCode($request->WhCode);
        if ($data == "notfound") {
            return response()->json([
                'errors' => 'WHCode not exist!'
            ], 404);
        } else {
            $whid = $data;
        }

        try {
            $query = "select CRATENO from Tbl_CrateMaster WITH(NOLOCK) where wh='" . $whid . "' AND CUSTID='" . Auth::user()->userid . "' AND CRATENO='" . $request->CrateNumber . "' and isnull(cratestatus,'')<>'' group by CRATENO";

            $results = DB::select($query);
            $count = count($results);
            if ($count > 0) {

                if (Str::upper($request->CrateNumber) != "MANUAL") {
                    $recursiveInc = 1;
                    $recursiveIncSort = 1;
                    $recursiveIncSortInsert = 1;
                    $this->createUpdateMethod($whid, Auth::user()->userid, $request->CrateNumber, $recursiveInc);
                    // wait for 2 milliseconds
                    usleep(2000);
                    $this->taskupdateMethod($whid, Auth::user()->userid, $request->CrateNumber, $recursiveIncSort);
                }

                if ($request->ShortQty > 0) {
                    $this->insertSortMethod($whid, Auth::user()->userid, $request->Sku, $request->ShortQty, $request->CrateNumber, $recursiveIncSortInsert, $request->OrderBatchNo);
                }

                return response()->json([
                    'success' => 'Crate Clouser Successfully Updated.'
                ], 200);


            } else {
                return response()->json([
                    'errors' => 'Crate not exist/Already Closed.'
                ], 404);
            }

        } catch (\Exception $error) {
            return $error->getMessage();
        }
    }



    public function createUpdateMethod($whid, $userid, $cardnumber, $recursiveInc)
    {
        $crateUpdate = "UPDATE Tbl_CrateMaster WITH(TABLOCK) SET CRATESKU=NULL,CRATESTATUS=NULL,CRATEPTLSTATUS=NULL,CRATESTATUSBY=NULL,CRATESTATUSON=GETDATE(),CRATEPUTQTY=NULL,ORDERBATCHNO=NULL WHERE wh='" . $whid . "' AND CUSTID='" . $userid . "' AND CRATENO='" . $cardnumber . "'";
        $crateUpdated = DB::update($crateUpdate);

        if ($recursiveInc <= 3) {
            if ($crateUpdated == false) {

                // wait for 2 milliseconds
                usleep(2000);
                $this->createUpdateMethod($whid, $userid, $cardnumber, $recursiveInc + 1);
            } else {
                return true;
            }

        } else {
            return false;
        }

    }

    public function taskupdateMethod($whid, $userid, $cardnumber, $recursiveIncSort)
    {
        $taskupdate = "UPDATE Tbl_Task_BatchSUB WITH(TABLOCK) SET CrateStatus='Y',CrateCloseOn=GETDATE() WHERE WH='" . $whid . "' AND CUSTID='" . $userid . "' AND CRATENO='" . $cardnumber . "' AND ISNULL(CrateStatus,'')=''  ";
        $taskupdated = DB::update($taskupdate);
        if ($recursiveIncSort <= 3) {
            if ($taskupdated == false) {
                // wait for 2 milliseconds
                usleep(2000);
                $this->taskupdateMethod($whid, $userid, $cardnumber, $recursiveIncSort + 1);
            } else {
                return true;
            }

        } else {
            return false;
        }
    }

    public function insertSortMethod($whid, $userid, $Sku, $ShortQty, $CrateNumber, $recursiveIncSortInsert, $OrderBatchNo)
    {
        $insertsort = "INSERT INTO Tbl_CrateSortData WITH(TABLOCK) (WH,CUSTID,SKU,QTY,Crateno,CrateSortby,CrateSortOn,orderbatchno)VALUES('" . $whid . "','" . $userid . "','" . $Sku . "','" . $SortQty . "','" . $CrateNumber . "','api',GETDATE(),'" . $OrderBatchNo . "')";
        $inserted = DB::insert($insertsort);
        if ($recursiveIncSortInsert <= 3) {
            if ($inserted == false) {
                // wait for 2 milliseconds
                usleep(2000);
                $this->insertSortMethod($whid, $userid, $Sku, $ShortQty, $CrateNumber, $recursiveIncSortInsert + 1);
            } else {
                return true;
            }

        } else {
            return false;
        }

    }
}