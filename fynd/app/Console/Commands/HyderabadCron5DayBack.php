<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use DB;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
class HyderabadCron5DayBack extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'Hyderabad:cron';

    /**
     * The console command description. 
     *
     * @var string
     */
    protected $description = 'Consume FYND  Hyderabad Data';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        //return 0;
        $accessToken = $this->findAccessTokenHyderabad();  
      
      //  $dateOrder = DB::table('fynd_orders_date')->first();
       // $dateOrder = \DB::table('fynd_orders_date')->where('WH','HYD')->first();
       
       // $orderDateFromValue = $dateOrder->fynd_orders_date; 
      
        //date_default_timezone_set('Asia/Kolkata');
        date_default_timezone_set('Asia/Kolkata');
        $today = date("Y-m-d");
        $fiveDayBack = date("Y-m-d", strtotime("-5 day"));
        $orderDateFromValue = $fiveDayBack.'T'.'12:00:00';
        $orderDateToValue =$today.'T'.'12:00:00'; 
        $current_date = date('Y-m-d H:i:s');
        if(!empty($accessToken['accessToken']))
        {
            
            try 
            {
                
                    $client = new Client();
                    $guzzleResponse = $client->get(                    
                        'https://api.fynd.com/hogwarts/aggregators/api/v2/Ginesys/shipment?pageNumber=1&orderStatus=CREATED&orderDateFrom='.$orderDateFromValue.'&orderDateTo='.$orderDateToValue.'&pageSize=100', [                    
                        'headers' => [
                            'apikey'=>$accessToken['accessToken']
                        ],
                    ]);
                if($guzzleResponse->getStatusCode() == 200)
                {
                     
                    $response = json_decode($guzzleResponse->getBody(),true);     
                    
                    $count =count($response['orders']);      
                   
                    for($i=0; $i < $count; $i++){    
                        $concatval = $response['orders'][$i]['id'] .'-'.$response['orders'][$i]['orderItems'][0]['orderItemId'];
                     
                        $refno = $response['orders'][$i]['id'];    

                        $query  = "SELECT distinct Ref_No FROM tbl_tempdn WITH(NOLOCK) 
                        where custid='SBERLC01' AND Ref_No='$concatval'  
                        UNION
                        SELECT distinct Ref_No FROM tbl_DN WITH(NOLOCK) where custid='SBERLC01' AND Ref_No='$concatval'  "; 

                        $results = DB::select($query);
                        
                     if(empty($results))
                     {       

                        if(count($response['orders'][$i]['orderItems']) === 1)
                        { 
                          $concatval = $response['orders'][$i]['id'] .'-'.$response['orders'][$i]['orderItems'][0]['orderItemId'];
                          \DB::table('tbl_tempdn')->insert( 
                              [                           
                                 
                                  'WH' => 'HYD',
                                  'custid' => 'SBERLC01',
                                  'CustTransType' => 'STN',
                                  'PartyName' => 'Ethnicity Limited - Hyderabad',
                                  'city' => 'Hyderabad',
                                  // 'CustInv' => $response['orders'][$i]['id'],
                                  'CustInv' =>  $concatval,
                                  'CustInvDate' => $response['orders'][$i]['orderDate'],
                                  'Cust_Amt' => $response['orders'][$i]['orderPrice']['totalPrepaidAmount'],
                                  'Cust_Amt_Currcy' =>  $response['orders'][$i]['orderPrice']['currency'],
                                  'ItemCode' => $response['orders'][$i]['orderItems'][0]['sku'],
                                  'Qty' => $response['orders'][$i]['orderItems'][0]['quantity'],
                                  'BatchNo' => '',
                                  //'Ref_No' => $response['orders'][$i]['id'],
                                  'ONLINEREFNO' => $response['orders'][$i]['id'],
                                  'Ref_No' => $concatval,
                                  'Ref_Date' => $response['orders'][$i]['orderDate'],
                                  'SalesOrderNo' => $response['orders'][$i]['marketplaceOrderId'],
                                  'sloc' => 'OK',
                                  'entryby' => 'API',
                                  'Createdby' => 'ONLINE',
                                  'entryon' => now(),
                                  'lineitem' => $response['orders'][$i]['orderItems'][0]['orderItemId'], 
                                  'storecode' => '3289',     
                                  'SAMPLE' => 'fynd'                     
                              ]
                          );   
                          $condition = [
                            ['REF_NO', $concatval],
                            ['custid', 'SBERLC01'],
                            ['WH', 'HYD'],
                        ];

                        DB::table('TBL_TEMPDN')
                            ->where($condition)                            
                            ->update([
                                'inflag' => 'Y'
                        ]); 
                      }else{
                               foreach($response['orders'][$i]['orderItems']  as $key => $value ){
                                $concatval = $response['orders'][$i]['id'] .'-'.$response['orders'][$i]['orderItems'][$key]['orderItemId'];
                              \DB::table('tbl_tempdn')->insert( 
                                  [                           
                                     
                                      'WH' => 'HYD',
                                      'custid' => 'SBERLC01',
                                      'CustTransType' => 'STN',
                                      'PartyName' => 'Ethnicity Limited - Hyderabad',
                                      'city' => 'Hyderabad',
                                     // 'CustInv' => $response['orders'][$i]['id'],
                                     'CustInv' => $concatval,
                                      'CustInvDate' => $response['orders'][$i]['orderDate'],
                                      'Cust_Amt' => $response['orders'][$i]['orderPrice']['totalPrepaidAmount'],
                                      'Cust_Amt_Currcy' =>  $response['orders'][$i]['orderPrice']['currency'],
                                      'ItemCode' => $response['orders'][$i]['orderItems'][$key]['sku'],
                                      'Qty' => $response['orders'][$i]['orderItems'][$key]['quantity'],
                                      'BatchNo' => '',
                                     // 'Ref_No' => $response['orders'][$i]['id'],
                                     
                                     'ONLINEREFNO' => $response['orders'][$i]['id'],
                                     'Ref_No' =>  $concatval,
                                      'Ref_Date' => $response['orders'][$i]['orderDate'],
                                      'SalesOrderNo' => $response['orders'][$i]['marketplaceOrderId'],
                                      'sloc' => 'OK',
                                      'entryby' => 'API',
                                      'Createdby' => 'ONLINE',
                                      'entryon' => now(),
                                      'lineitem' => $response['orders'][$i]['orderItems'][$key]['orderItemId'], 
                                      'storecode' => '3289',       
                                      'SAMPLE' => 'fynd'                   
                                  ]
                              ); 
                              $condition = [
                                ['REF_NO', $concatval],
                                ['custid', 'SBERLC01'],
                                ['WH', 'HYD'],
                            ];

                            DB::table('TBL_TEMPDN')
                                ->where($condition)                            
                                ->update([
                                    'inflag' => 'Y'
                            ]);   
                          }
  
                      } 
                        \DB::table('Tbl_APILOG')->insert( 
                            [                             
                                'APINAME' => 'ONLINESO',
                                'ENTRYON' => $current_date,
                                'APISTATUS' => 'TRUE',                              
                                'APIMESSAGE' => 'ORDER completed successfully',                                
                                'REFERENCENO' => $response['orders'][$i]['id']      
                                                 
                            ]
                        );  
                        // DB::table('TBL_TEMPDN')
                        // ->where('REF_NO', $concatval)
                        // ->where('custid', 'SBERLC01')
                        // ->where('WH', 'HYD')
                        // ->update([
                        //     'inflag' => 'Y'
                        // ]);   
                    }    
                }
                  // DB::table('fynd_orders_date')->where('id',2)->update(array('fynd_orders_date'=>$orderDateToValue));  
                         
                }                
            } catch (RequestException $e) {
            // you can catch here 400 response errors and 500 response errors
            // see this https://stackoverflow.com/questions/25040436/guzzle-handle-400-bad-request/25040600
            } catch(\Exception $e){
                //other errors 
            }
        }      
   }

    

    public function findAccessTokenHyderabad()
{  
   
     try {
         $client = new Client();
         $guzzleResponse = $client->get(
             //Ethnicity Limited - Hyderabad
             //'https://api.fyndx1.de/hogwarts/aggregators/api/v1/Increff/authToken?username=60810381a395e1763b09aaee&password=yUyyLx4Tb'

             // Ethnicity Limited - Bhiwandi
             'https://api.fynd.com/hogwarts/aggregators/api/v1/Ginesys/authToken?username=5cee2ffdbbec8caa0ba74d15&password=S5VTHMWPy' 
             
             
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
}
