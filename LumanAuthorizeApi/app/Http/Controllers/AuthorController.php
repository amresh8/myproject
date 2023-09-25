<?php

namespace App\Http\Controllers;

use App\Traits\apiResponser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Models\Author;

class AuthorController extends Controller
{
    use apiResponser;
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function __construct()
    {

    }


    public function index()
    {

        $authors = Author::all();
        return $this->successResponser($authors);

    }

    public function show($author)
    {

        return $this->successResponser(Author::findOrFail($author));
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|max:225',
            'gender' => 'required|max:225|in:male,female',
            'country' => 'required|max:225'
        ];
        $this->validate($request, $rules);
        $author = Author::create($request->all());
        return $this->successResponser($author, Response::HTTP_CREATED);

    }
    public function update(Request $request, $author)
    {
        $rules = [
            'name' => 'required|max:225',
            'gender' => 'required|max:225|in:male,female',
            'country' => 'required|max:225'
        ];
        $this->validate($request, $rules);

        $author = Author::findOrFail($author);
        $author->fill($request->all());


        if ($author->isClean()) {
            return $this->errorResponser('At least on value must chnage', Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        $author->save();
        return $this->successResponser($author);

    }
    public function destroy($author)
    {
        $author = Author::findOrFail($author);
        $author->delete();
        return $this->successResponser($author);



    }
}