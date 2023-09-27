<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function userRegister(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed'
        ]);

        if (User::where('email', $request->email)->first()) {
            return response([
                'message' => 'Email already exits',
                'status' => 'failed'
            ], 200);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);
        $token = $user->createToken($request->email)->plainTextToken;
        return response([
            'token' => $token,
            'message' => 'User Regiser Successfully!',
            'status' => 'success'
        ], 200);

    }

    public function generateToken(Request $request)
    {

        $request->validate([
            'userid' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('userid', $request->userid)->first();


        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken($request->userid)->plainTextToken;

            return response([
                'token' => $token,
                'custid' => $request->userid,
                'status' => 'success'
            ], 200);
        }
        return response([
            'message' => 'Provided Credential is incorrect',
            'status' => 'failed'
        ], 401);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response([
            'message' => ' Logout Successuflly!',
            'status' => 'success'
        ], 200);
    }


}