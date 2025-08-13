<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalaryDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalaryDetailController extends Controller
{
    /**
     * Display a listing of the salary details for the admin.
     */
    public function index()
    {
        return SalaryDetail::orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created record or update an existing one based on email.
     * This is for the user submission form.
     */
    public function storeOrUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'salary_in_local_currency' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3', // Validate the new currency field
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // The core logic: Find a record by email or create a new one.
        $salaryDetail = SalaryDetail::updateOrCreate(
            ['email' => $request->email], // Condition to find the record
            [                           // Data to update or create with
                'name' => $request->name,
                'salary_in_local_currency' => $request->salary_in_local_currency,
                'currency' => $request->currency, // Save the new currency field
            ]
        );

        return response()->json($salaryDetail, 200);
    }

    /**
     * Update the specified salary detail in storage.
     * This is for the admin panel.
     */
    public function update(Request $request, SalaryDetail $salaryDetail)
    {
        // 'sometimes' means only validate if the field is present in the request
        $validator = Validator::make($request->all(), [
            'salary_in_local_currency' => 'sometimes|numeric|min:0',
            'salary_in_euros' => 'sometimes|numeric|min:0',
            'commission' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $salaryDetail->update($request->all());

        return response()->json($salaryDetail, 200);
    }
}
