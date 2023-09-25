<?php

namespace App\Http\Controllers;

use App\Traits\apiResponser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Book;
use App\Services\BookService;
use App\Services\AuthorService;

class BookController extends Controller
{
    use apiResponser;
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public $bookService;
    public $authorService;
    public function __construct(BookService $bookService, AuthorService $authorService)
    {
        $this->bookService = $bookService;
        $this->authorService = $authorService;
    }

    public function index()
    {

        return $this->successResponser($this->bookService->obtainBooks());
    }

    public function show($book)
    {
        return $this->successResponser($this->bookService->obtainBook($book));

    }

    public function store(Request $request)
    {
        $this->authorService->obtainAuthor($request->auther_id);
        return $this->successResponser($this->bookService->createBook($request->all(), Response::HTTP_CREATED));
    }
    public function update(Request $request, $book)
    {

        return $this->successResponser($this->bookService->updateBook($request->all(), $book));
    }
    public function destroy($book)
    {
        return $this->successResponser($this->bookService->deleteBook($book));
    }
}