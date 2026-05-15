# Frontend and Backend Data Flow

Inkbooks uses Inertia to connect Laravel/PHP to React/TSX.

The short version:

```txt
TSX is the screen.
Laravel is the server.
SQL is behind Laravel.
Blade is only the outlet the React app plugs into.
```

Blade does not become a backend package that TypeScript executes. The Blade file at `resources/views/app.blade.php` only loads Vite and mounts Inertia.

## The Mental Model

Think of Inertia like a waiter:

- React/TSX asks for a page or submits a form.
- Laravel receives the request.
- Laravel reads/writes the database.
- Laravel hands Inertia a React page name plus props.
- React renders those props as HTML in the browser.

```txt
Browser TSX -> Laravel route/controller -> Eloquent/SQL -> Inertia props -> TSX renders HTML
```

## Reading Data From PHP/SQL

Laravel queries the database and passes plain data to a TSX page.

```php
use App\Models\Book;
use Inertia\Inertia;

Route::get('/books', function () {
  return Inertia::render('books/index', [
    'books' => Book::query()
      ->latest()
      ->get(['id', 'title']),
  ]);
});
```

This renders:

```txt
resources/js/pages/books/index.tsx
```

The TSX page receives `books` as props:

```tsx
type Book = {
  id: number;
  title: string;
};

export default function BooksIndex({ books }: { books: Book[] }) {
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
}
```

## Writing Data To PHP/SQL

TSX submits data to a Laravel route. Laravel validates, writes to SQL, then redirects.

```tsx
import { router } from '@inertiajs/react';

export default function CreateBookButton() {
  return (
    <button
      onClick={() => {
        router.post('/books', {
          title: 'Algebra Notes',
        });
      }}
    >
      Save
    </button>
  );
}
```

Laravel receives the POST:

```php
use App\Models\Book;
use Illuminate\Http\Request;

Route::post('/books', function (Request $request) {
  Book::create($request->validate([
    'title' => ['required', 'string', 'max:255'],
  ]));

  return redirect('/books');
});
```

This is the usual PRG pattern:

```txt
POST /books -> write database -> redirect -> GET /books
```

The redirect prevents refresh-from-resubmitting and gives the page fresh database data.
