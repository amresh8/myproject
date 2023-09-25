<?php
namespace App\Services;

use App\Traits\consumeExternalService;

class BookService
{
    use consumeExternalService;
    public $baseUri;
    public function __construct()
    {
        $this->baseUri = config('services.books.base_uri');

    }


    public function obtainBooks()
    {
        return $this->performRequest('GET', '/books');
    }

    public function obtainBook($book)
    {
        return $this->performRequest('GET', "/books/{$book}");
    }

    public function createBook($data)
    {
        return $this->performRequest('POST', '/books', $data);
    }

    public function updateBook($data, $bookId)
    {
        return $this->performRequest('PUT', "/books/{$bookId}", $data);
    }

    public function deleteBook($book)
    {

        return $this->performRequest('DELETE', "/books/{$book}");

    }
}
?>