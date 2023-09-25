<?php
namespace App\Traits;

use Illuminate\Http\Response;

trait apiResponser
{
    public function successResponser($data, $code = Response::HTTP_OK)
    {
        return response()->json(['data' => $data], $code);
    }

    public function errorResponser($message, $code)
    {
        return response()->json(['error' => $message, 'code' => $code], $code);
    }

}
?>