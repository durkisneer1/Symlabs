<?php

namespace App\Http\Controllers;

use App\Models\Quizzes\Quiz;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return view('quizzes.index', [
            'quizzes' => Quiz::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('quizzes.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Quiz::create([
            'slug' => request('slug'),
            'title' => request('title'),
            'description' => request('description'),
            'question_count' => request('question_count'),
            'time_limit_minutes' => request('time_limit_minutes'),
        ]);

        return redirect('/quizzes');
    }

    /**
     * Display the specified resource.
     */
    public function show(Quiz $quiz)
    {
        return view('quizzes.show', [
            'quiz' => $quiz,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quiz $quiz)
    {
        return view('quizzes.edit', [
            'quiz', $quiz,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quiz $quiz)
    {
        $quiz->update([
            'slug' => request('slug'),
            'title' => request('title'),
            'description' => request('description'),
            'question_count' => request('question_count'),
            'time_limit_minutes' => request('time_limit_minutes'),
        ]);

        return redirect("/quizzes/{$quiz->id}");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return redirect('/quizzes');
    }
}
