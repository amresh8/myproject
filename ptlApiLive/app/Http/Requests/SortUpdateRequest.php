<?php

namespace App\Http\Requests;

use Illuminate\Http\Request;
use Illuminate\Foundation\Http\FormRequest;

class SortUpdateRequest extends FormRequest
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
    public function rules()
    {
        return [
            'WhCode' => 'required|string|max:20|regex:/^[A-Za-z0-9\-\s]+$/',
            'OrderBatchNo' => 'required|string|max:50',
            'StoreCode' => 'required|string|min:1|max:10',
            'Weight' => 'required',
            'ITEMS' => 'required|array',
            'ITEMS.*.SalesOrderNo' => 'required',
            'ITEMS.*.DnNo' => 'required',
            'ITEMS.*.Sku' => 'required',
            'ITEMS.*.LineItem' => 'required',
            'ITEMS.*.Qty' => 'required|numeric',
        ];
    }
}