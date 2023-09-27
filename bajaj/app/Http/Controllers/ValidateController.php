<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class ValidateController extends Controller
{
    public function validateValue(Request $request){
       
       if(!empty($request->accessKey)){
          
        $token = DB::table('bajajtoken')->where('token',$request->accessKey)->get();
         
         $sql= "select distinct sku from Tbl_SerialOut with(nolock) where CUSTID='".$token[0]->custid."' and SKU='".$request->materialCode."' AND SerialNo='".$request->serialNumber."' AND ISNULL(APIVALID,'')=''";
        
         $data = DB::select($sql);
         $numrow = count($data);


         if($numrow > 0){
                return response()->json(['responseStatus'=>0,'responseMessage'=>'Valid Serial Number']);
         }else{
            $sql= "select distinct sku from Tbl_SerialOut with(nolock) where CUSTID='".$token[0]->custid."' and SKU='".$request->materialCode."' AND SerialNo='".$request->serialNumber."' AND ISNULL(APIVALID,'')<>''";
            $data = DB::select($sql);
            $numrow = count($data);
            if($numrow > 0){
                return response()->json(['responseStatus'=>-3,'responseMessage'=>'Serial Number Already Validated']);
            }else{
                
            }
          
         }
         
        
       }else{
            return response()->json(['error'=>'Token not foound'],404);
       }
     
    }


    // public function validateToken($tokenval){
    //     return response()->json($tokenval);
    //     $sql = "select * From bajajtoken where token='$tokenval'";
    //     return response()->json($sql);

    //     $token = DB::table('bajajtoken')->where('token',$tokenval)->get();
    //    return response($token);
    // }
}
