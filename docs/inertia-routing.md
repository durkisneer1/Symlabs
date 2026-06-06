# Inertia Routing

Symlabs uses Laravel routes to render React pages through Inertia. Components from shadcn/ui are React components, so they work on any route that returns an Inertia page.

The choice between `Route::inertia` and `Route::get` is about backend logic, not about whether React components will work.

## Simple Pages

Use `Route::inertia` when the route only needs to render a page.

```php
Route::inertia('/', 'welcome')->name('home');
```

This renders:

```txt
resources/js/pages/welcome.tsx
```

That page can import and use shadcn/ui components normally.

## Pages With Backend Logic

Use `Route::get` when Laravel needs to do work before rendering the page, such as loading models, checking state, or building props.

```php
use Inertia\Inertia;

Route::get('/lessons', function () {
    return Inertia::render('lessons/index', [
        'lessons' => Lesson::query()
            ->latest()
            ->get(),
    ]);
})->name('lessons.index');
```

This still renders a React/Inertia page, so shadcn/ui components still work.
