<?php
namespace App\Traits;

use Illuminate\Http\Response;

trait apiResponser
{
    public function successResponser($data, $code = Response::HTTP_OK)
    {
        return response($data, $code)->header('content-Type', 'application/json');
    }

    public function errorResponser($message, $code)
    {
        return response()->json(['error' => $message, 'code' => $code], $code);
    }

    public function errorMessage($message, $code)
    {
        return response($message, $code)->header('content-Type', 'application/json');
    }

}
?>