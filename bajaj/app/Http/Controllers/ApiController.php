<?php

namespace App\Http\Controllers;
use DB;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
  
class ApiController extends Controller
{
   public function findAccessTokenBhiwandi()
   {  
    
        try {
            $client = new Client();
            $guzzleResponse = $client->get(
                //Ethnicity Limited - Hyderabad
                //'https://api.fyndx1.de/hogwarts/aggregators/api/v1/Increff/authToken?username=60810381a395e1763b09aaee&password=yUyyLx4Tb'

                // Ethnicity Limited - Bhiwandi
                'https://api.fyndx1.de/hogwarts/aggregators/api/v1/Increff/authToken?username=60810381a395e1763b09aaee&password=IxKoVx4Np' 
                
                
            );

            if ($guzzleResponse->getStatusCode() == 200) {
                $response = json_decode($guzzleResponse->getBody(),true);
                return $response;
            }
        
        } catch (RequestException $e) {
            // you can catch here 400 response errors and 500 response errors
            // see this https://stackoverflow.com/questions/25040436/guzzle-handle-400-bad-request/25040600
        } catch(\Exception $e){
        //other errors 
        }   
    }

// Access Token For Hyderabad


public function findAccessTokenHyderabad()
{  
   
     try {
         $client = new Client();
         $guzzleResponse = $client->get(
             //Ethnicity Limited - Hyderabad
             //'https://api.fyndx1.de/hogwarts/aggregators/api/v1/Increff/authToken?username=60810381a395e1763b09aaee&password=yUyyLx4Tb'

             // Ethnicity Limited - Bhiwandi
             'https://api.fyndx1.de/hogwarts/aggregators/api/v1/Increff/authToken?username=60810381a395e1763b09aaee&password=yUyyLx4Tb' 
             
             
         );

         if ($guzzleResponse->getStatusCode() == 200) {
             $response = json_decode($guzzleResponse->getBody(),true);
             return $response;
         }
     
     } catch (RequestException $e) {
         // you can catch here 400 response errors and 500 response errors
         // see this https://stackoverflow.com/questions/25040436/guzzle-handle-400-bad-request/25040600
     } catch(\Exception $e){
     //other errors 
     }   
 }


// Access toke for Hyderabad End



   public function findOrdersBhiwandi()
   {   

 
      $accessToken = $this->findAccessTokenBhiwandi();  
      dd($accessToken);
       // $dateOrder = DB::table('fynd_orders_date')->where('city','bhiwandi')->first();
       $dateOrder =  DB::connection("sqlsrv")->table("fynd_orders_date")->where('WH','BIR')->first(); 
              
        $orderDateFromValue = $dateOrder->fynd_orders_date; 

        date_default_timezone_set('Asia/Kolkata');
        $timestamp = date("Y-m-d H:i:s");
        $dateTime = explode(" ",$timestamp); 
       
        $orderDateToValue = $dateTime[0].'T'.$dateTime[1] ;
        $current_date = date('Y-m-d H:i:s');
        if(!empty($accessToken['accessToken']))
        {
            try 
            {
                    $client = new Client();
                    $guzzleResponse = $client->get(                    
                    'https://api.fyndx1.de/hogwarts/aggregators/api/v2/Blackberry/shipment?orderStatus=CREATED&pageSize=100&pageNumber=1&orderDateFrom='.$orderDateFromValue.'&orderDateTo='.$orderDateToValue, [                    
                    'headers' => [
                        'apikey'=>$accessToken['accessToken']
                    ],
                ]);
                if($guzzleResponse->getStatusCode() == 200)
                {
                    $response = json_decode($guzzleResponse->getBody(),true);  
                     dd($response);
                    $count =count($response['orders']); 
                    
                    for($i=0; $i < $count; $i++){ 
 
                    //     $refno = $response['orders'][$i]['forward_id'];
                        
                    //     $query  = "SELECT distinct Ref_No FROM tbl_tempdn WITH(NOLOCK) 
                    //     where custid='SBERLC01' AND Ref_No='$refno'
                    //     UNION
                    //     SELECT distinct Ref_No FROM tbl_DN WITH(NOLOCK) where custid='SBERLC01' AND Ref_No='$refno'";
                    
                    //  $results = DB::select($query);
                    




                               $datas =  [    
                                'WH' => 'BIR',
                                'CUSTID' => 'SBERLC01',
                                'CustTransType' => 'STN',
                                'PartyName' => 'Ethnicity Limited - Bhiwandi',
                                'city' => 'BHIWANDI',
                                'CustInv' => $response['orders'][$i]['forward_id'],
                                'CustInvDate' => $response['orders'][$i]['orderDate'],
                                'Cust_Amt' => $response['orders'][$i]['orderPrice']['totalPrepaidAmount'],
                                'Cust_Amt_Currcy' =>  $response['orders'][$i]['orderPrice']['currency'],
                                'ItemCode' => $response['orders'][$i]['orderItems'][0]['sku'],
                                'Qty' => $response['orders'][$i]['orderItems'][0]['quantity'],
                                'BatchNo' => '',
                                'REF_nO' => $response['orders'][$i]['forward_id'],
                                'REF_DATE' => $response['orders'][$i]['orderDate'],
                                'SalesOrderNo' => $response['orders'][$i]['marketplaceOrderId'],
                                'sloc' => 'OK',
                                'entryby' => 'API',
                                'entryon' =>   now(),
                                'lineitem' => $response['orders'][$i]['orderItems'][0]['orderItemId'], 
                               'storecode' => '3240'                     
                               ];
                            
                             \DB::connection("sqlsrv")->table('fynd_orders')->insert($datas);  

                               
                             \DB::connection("sqlsrv2")->table('Tbl_APILOG')->insert( 
                                [    
                                    'APINAME' => 'ONLINESO',
                                    'ENTRYON' => $current_date,
                                    'APISTATUS' => 'TRUE',                              
                                    'APIMESSAGE' => 'ORDER completed successfully',                                
                                    'REFERENCENO' => $response['orders'][$i]['forward_id']                   
                                ]
                            );    

                              
                               
                                          
                    }    
                    
                    DB::connection("sqlsrv")->table('fynd_orders_date')->where('id',5)->update(array('fynd_orders_date'=>$orderDateToValue));   
                         
                }                
            } catch (RequestException $e) {
            // you can catch here 400 response errors and 500 response errors
            // see this https://stackoverflow.com/questions/25040436/guzzle-handle-400-bad-request/25040600
            } catch(\Exception $e){
                //other errors 
            }
        }      
   }




   public function findOrdersHyderabad()
   {     
 
   
        $accessToken = $this->findAccessTokenHyderabad();  
        dd($accessToken);
       // $dateOrder = DB::table('fynd_orders_date')->first();
         
        $dateOrder =  DB::connection("sqlsrv")->table("fynd_orders_date")->where('WH','HYD')->first();
        $orderDateFromValue = $dateOrder->fynd_orders_date; 
      
        date_default_timezone_set('Asia/Kolkata');
        $timestamp = date("Y-m-d H:i:s");
        $dateTime = explode(" ",$timestamp); 
       
        $orderDateToValue = $dateTime[0].'T'.$dateTime[1] ;
         
        if(!empty($accessToken['accessToken']))
        {
           
            try 
            {
                    $client = new Client();
                    $guzzleResponse = $client->get(                    
                    'https://api.fyndx1.de/hogwarts/aggregators/api/v2/ dd($accessToken);Blackberry/shipment?orderStatus=CREATED&pageSize=100&pageNumber=1&orderDateFrom='.$orderDateFromValue.'&orderDateTo='.$orderDateToValue, [                    
                    'headers' => [
                        'apikey'=>$accessToken['accessToken']
                    ],
                ]);
 
                if($guzzleResponse->getStatusCode() == 200)
                {
                    $response = json_decode($guzzleResponse->getBody(),true);        
                    dd($response); 
                    $count =count($response['orders']);      
                    $current_date_hy = date('Y-m-d H:i:s');
                    for($i=0; $i < $count; $i++){    
                     
                        DB::connection("sqlsrv")->table('fynd_orders')->insert( 
                            [                              
                              //  'marketplaceOrderId' =>  $response['orders'][$i]['marketplaceOrderId'],
                                'WH' => 'BIR',
                                'CUSTID' => 'SBERLC01',
                                'CustTransType' => 'STN',
                                'PartyName' => 'Ethnicity Limited - Hyderabad',
                                'city' => 'Hyderabad',
                                'CustInv' => $response['orders'][$i]['forward_id'],
                                'CustInvDate' => $response['orders'][$i]['orderDate'],
                                'Cust_Amt' => $response['orders'][$i]['orderPrice']['totalPrepaidAmount'],
                                'Cust_Amt_Currcy' =>  $response['orders'][$i]['orderPrice']['currency'],
                                'ItemCode' => $response['orders'][$i]['orderItems'][0]['sku'],
                                'Qty' => $response['orders'][$i]['orderItems'][0]['quantity'],
                                'BatchNo' => '',
                                'REF_nO' => $response['orders'][$i]['forward_id'],
                                'REF_DATE' => $response['orders'][$i]['orderDate'],
                                'SalesOrderNo' => $response['orders'][$i]['marketplaceOrderId'],
                                'sloc' => 'OK',
                                'entryby' => 'API',
                                'entryon' => now(),
                                'lineitem' => '',
                                'storecode' => '3289',                      
                            ]
                        );   

                        \DB::connection("sqlsrv2")->table('Tbl_APILOG')->insert( 
                            [    
                                'APINAME' => 'ONLINESO',
                                'ENTRYON' => $current_date_hy, 
                                'APISTATUS' => 'TRUE',                              
                                'APIMESSAGE' => 'ORDER completed successfully',                                
                                'REFERENCENO' => $response['orders'][$i]['forward_id'],                      
                            ]
                        ); 
                    }    
                  
                   DB::connection("sqlsrv")->table('fynd_orders_date')->where('id',6)->update(array('fynd_orders_date'=>$orderDateToValue));   
                         
                }                
            } catch (RequestException $e) {
            // you can catch here 400 response errors and 500 response errors
            // see this https://stackoverflow.com/questions/25040436/guzzle-handle-400-bad-request/25040600
            } catch(\Exception $e){
                //other errors 
            }
        }      
   }

}
