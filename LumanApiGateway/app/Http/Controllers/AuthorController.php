<?php

namespace App\Http\Controllers;

use App\Services\AuthorService;
use App\Traits\apiResponser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Models\Author;

class AuthorController extends Controller
{
    use apiResponser;

    public $authorService;
    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function __construct(AuthorService $authorService)
    {
        $this->authorService = $authorService;

    }


    public function index()
    {

        return $this->successResponser($this->authorService->obtainAuthors());
    }

    public function show($author)
    {
        return $this->successResponser($this->authorService->obtainAuthor($author));

    }

    public function store(Request $request)
    {
        return $this->successResponser($this->authorService->createAuthor($request->all(), Response::HTTP_CREATED));
    }
    public function update(Request $request, $author)
    {

        return $this->successResponser($this->authorService->updateAuthor($request->all(), $author));
    }
    public function destroy($author)
    {
        return $this->successResponser($this->authorService->deleteAuthor($author));
    }
}