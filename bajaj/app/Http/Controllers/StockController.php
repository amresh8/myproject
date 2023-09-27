<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StockController extends Controller
{
    public function getStock(Request $request){
        
     
        $tokenvalue = $this->findToken();
        
       
        if($tokenvalue){
            $custid = "SBERLC01";
            
            // $token = json_encode($tokenvalue->original['token']); 
            // $token = trim($token,'"');  
         

            $whQuery = DB::table('tbl_WHCustmapping')
            ->where([['CUSTID','SBERLC01','CLIENTUUID',$request->WH]])->lock('WITH(NOLOCK)')->get();


            $countWh = count($whQuery);
            $warehouseName = $whQuery[0]->WHID;  
            
             if($countWh >0){

                $querybatch = DB::table('Tbl_CycleCountBatch')
                ->where([['batchid',$request->BatchId],['custid','SBERLC01'],['wh',$warehouseName],['RackLocation',$request->BinDetails[0]['Bin']]])
                ->get(); 
                $countbid = count($querybatch);

                if($countbid >0){
                 
                    $rac = $request->BinDetails[0]['Bin'];

                    $skuRequetVal = $request->BinDetails[0]['SkuDetail'];
                     
                    $skuRequestValTotal = count($skuRequetVal);
                    for($i=0;$i<$skuRequestValTotal;$i++){
                        
                        $sku = DB::table('Tbl_CycleCountScan')->where([['CUSTID','SBERLC01'],['wh',$warehouseName],['batchid',$request->BatchId],['whlocation',$rac],['SKU',$skuRequetVal[$i]['SkuCode']]])->get();
                        
                        $count = count($sku);
                       
                        if($count > 0){
                          
                            $updatequery = "UPDATE Tbl_CycleCountScan WITH(TABLOCK) SET QTY='".$skuRequetVal[$i]['received_qty']."',entryon=GETDATE()  WHERE WH='$warehouseName' AND CUSTID='SBERLC01' AND BATCHID='".$request->BatchId."' AND  WHLocation='".$rac."'  AND SKU='".$skuRequetVal[$i]['SkuCode']."'";
                            $update = DB::update($updatequery);
                             
                        }else{
                            
                            $insert = "INSERT INTO Tbl_CycleCountScan WITH(TABLOCK)(WH,CUSTID,BATCHID,WHLOCATION,SKU,QTY,ENTRYBY,ENTRYON,SLOC)VALUES('$warehouseName','SBERLC01','".$request->BatchId."','".$rac."','".$skuRequetVal[$i]['SkuCode']."','".$skuRequetVal[$i]['received_qty']."','API',GETDATE(),'OK')";
                           
                            $insertquery = DB::insert($insert);
                            
                        }
                         
                    } 
                    $upQuery = "UPDATE Tbl_CycleCountBatch WITH(TABLOCK) SET Binstatus='Y',BinBy='API',BinOn=GETDATE() WHERE wh='".$warehouseName."' and Custid='SBERLC01'   AND RackLocation='".$rac."' AND Batchid='".$request->BatchId."' ";
                    
                    $update = DB::update($upQuery);

                    return response()->json(['success'=>'Inserted Successfully'],200);

                }else{
                    return response()->json(['error'=>'Batch Not Found/ Batch Closed']);
                }
 
             }else{
                return response()->json(['error'=>'invalid custid or warehouse']);
             }
        }else{
            return response()->json(['error'=>'Invalid Token']);
        } 
    }


    public function findToken(){
        $data = array( 
            'userid' => 'SBERLC01',
           'password' =>'SBERLC01'
         );
         
        $user = User::where('userid',$data['userid'])->first(); 
         
        if($user && Hash::check($data['password'], $user->password)){
            $token = $user->createToken($data['userid'])->plainTextToken;  
            return response([
                'token'  => $token,
                'custid' => $data['userid'],              
                'status' =>'success'
            ],200);
        }
        return response([          
            'message' => 'Provided Credential is incorrect',
            'status' =>'failed'
        ],401);
    }
}
