<?php
namespace App\Services;

use App\Traits\consumeExternalService;

class AuthorService
{
    use consumeExternalService;
    public $baseUri;

    public function __construct()
    {
        $this->baseUri = config('services.authors.base_uri');
    }

    public function obtainAuthors()
    {
        return $this->performRequest('GET', '/authors');
    }

    public function obtainAuthor($author)
    {
        return $this->performRequest('GET', "/authors/{$author}");
    }

    public function createAuthor($data)
    {
        return $this->performRequest('POST', '/authors', $data);
    }

    public function updateAuthor($data, $authorId)
    {
        return $this->performRequest('PUT', "/authors/{$authorId}", $data);
    }

    public function deleteAuthor($author)
    {

        return $this->performRequest('DELETE', "/authors/{$author}");

    }
}
?>