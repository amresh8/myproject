<?php

namespace App\Http\Controllers;

use App\Traits\apiResponser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Book;

class BookController extends Controller
{
    use apiResponser;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function index()
    {

        $books = Book::all();
        return $this->successResponser($books);

    }

    public function show($book)
    {

        return $this->successResponser(Book::findOrFail($book));
    }

    public function store(Request $request)
    {
        $rules = [
            'title' => 'required|max:225',
            'description' => 'required',
            'price' => 'required|numeric',
            'auther_id' => 'required|max:225'
        ];
        $this->validate($request, $rules);

        $book = Book::create($request->all());
        return $this->successResponser($book, Response::HTTP_CREATED);

    }
    public function update(Request $request, $book)
    {
        $rules = [
            'title' => 'required|max:225',
            'description' => 'required',
            'price' => 'required|numeric',
            'auther_id' => 'required|max:225'
        ];
        $this->validate($request, $rules);

        $book = Book::findOrFail($book);
        $book->fill($request->all());


        if ($book->isClean()) {
            return $this->errorResponser('At least on value must chnage', Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $book->save();
        return $this->successResponser($book);

    }
    public function destroy($book)
    {
        $book = Book::findOrFail($book);
        $book->delete();
        return $this->successResponser($book);



    }
}