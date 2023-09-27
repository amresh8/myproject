<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApiUpdateRequest extends FormRequest
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
            'CrateNumber' => 'required|string|max:50',
            'Sku' => 'required|string|max:50',
            'ShortQty' => 'required|numeric|min:1|max:5',

        ];
    }
}