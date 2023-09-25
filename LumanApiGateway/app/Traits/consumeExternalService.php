<?php
namespace App\Traits;

use GuzzleHttp\Client;

trait consumeExternalService
{
    public function performRequest($method, $requstUrl, $formParams = [], $headers = [])
    {

        $client = new Client([
            'base_uri' => $this->baseUri,
        ]);

        $response = $client->request($method, $requstUrl, ['form_params' => $formParams, 'headers' => $headers]);

        return $response->getBody()->getContents();
    }
}


?>