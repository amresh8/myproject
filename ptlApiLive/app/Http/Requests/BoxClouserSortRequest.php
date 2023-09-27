<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;

class BoxClouserSortRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(Request $request)
    {

        //$data = ['data' => $request->all()];


        return [
            'WhCode' => 'required|string|max:20|regex:/^[A-Za-z0-9\-\s]+$/',
            'OrderBatchNo' => 'required|string|max:50',
            'BoxNo' => 'required|string|min:1|max:50',
            'ITEMS' => 'required|array',
            'ITEMS.*.Sku' => 'required',
            'ITEMS.*.ShortQty' => 'required|numeric',

        ];
    }
}