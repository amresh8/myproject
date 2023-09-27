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
        $dateOrder = DB::table('fynd_orders_date')->where('city','bhiwandi')->first();
             
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
                    'https://api.fyndx1.de/hogwarts/aggregators/api/v2/Blackberry/shipment?orderStatus=CREATED&pageSize=100&pageNumber=1&orderDateFrom='.$orderDateFromValue.'&orderDateTo='.$orderDateToValue, [                    
                    'headers' => [
                        'apikey'=>$accessToken['accessToken']
                    ],
                ]);
                if($guzzleResponse->getStatusCode() == 200)
                {
                    $response = json_decode($guzzleResponse->getBody(),true);                     
                    $count =count($response['orders']);  
                    
                   
                    for($i=0; $i < $count; $i++){                         
                        DB::table('fynd_orders')->insert( 
                            [                             
                               
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
                                'entryon' => now(),
                                'lineitem' => $response['orders'][$i]['orderItems'][0]['orderItemId'], 
                                'storecode' => '3240',                      
                            ]
                        );   
                    }    
                   DB::table('fynd_orders_date')->where('id',1)->update(array(                  'fynd_orders_date'=>$orderDateToValue));  
                         
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
        $dateOrder = DB::table('fynd_orders_date')->first();
       
        $orderDateFromValue = $dateOrder->fynd_orders_date; 
        $orderDateFromValue ='2022-08-26T15:10:53';
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
                    'https://api.fyndx1.de/hogwarts/aggregators/api/v2/Blackberry/shipment?orderStatus=CREATED&pageSize=100&pageNumber=1&orderDateFrom='.$orderDateFromValue.'&orderDateTo='.$orderDateToValue, [                    
                    'headers' => [
                        'apikey'=>$accessToken['accessToken']
                    ],
                ]);
                if($guzzleResponse->getStatusCode() == 200)
                {
                    $response = json_decode($guzzleResponse->getBody(),true);                     
                    $count =count($response['orders']);      
                   
                    for($i=0; $i < $count; $i++){    
                     
                        DB::table('fynd_orders')->insert( 
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
                    }    
                   DB::table('fynd_orders_date')->where('id',1)->update(array(                  'fynd_orders_date'=>$orderDateToValue));  
                         
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
