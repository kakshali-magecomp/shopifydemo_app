<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontEndControllr extends Controller
{

public static function middleware(): array
     {
         return [
            new Middleware('verify.shopify', only: ['index']),
        ];
    }

    public function index()
    {
        return view('welcome');
    }

    // public static function middleware(): array
    // {
    //     return [
    //         new Middleware('verify.shopify', only: ['index']),
    //     ];
    // }
    // public function getdata()
    // {
    //     $shop = Auth::user();
    //     $getdata = $shop->getdata();
    //     return view('welcome',compact('getdata'));
    // }
}
