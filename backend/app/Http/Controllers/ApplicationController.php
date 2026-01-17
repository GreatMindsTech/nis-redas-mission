<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ApplicationController extends Controller
{
    /**
     * Get all applications (with role-based filtering)
     */
    public function index(Request $request)
    {
        $query = Application::query();

        if ($request->user()->role === 'user') {
            $query->where('user_id', $request->user()->id);
        }

        $applications = $query->with('user', 'mission', 'reviewer')->paginate(15);
        return response()->json($applications);
    }

    /**
     * Get single application
     */
    public function show(Application $application)
    {
        Gate::authorize('view', $application);
        return response()->json($application->load('user', 'mission', 'reviewer'));
    }

    /**
     * Create new application
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mission_id' => 'nullable|exists:missions,id',
            'type' => 'required|in:visa,passport,certificate,other',
            'description' => 'nullable|string',
            'data' => 'nullable|array',
        ]);

        $application = Application::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'draft',
        ]);

        return response()->json($application, 201);
    }

    /**
     * Update application
     */
    public function update(Request $request, Application $application)
    {
        Gate::authorize('update', $application);

        $validated = $request->validate([
            'type' => 'sometimes|in:visa,passport,certificate,other',
            'description' => 'nullable|string',
            'data' => 'nullable|array',
        ]);

        if ($application->status !== 'draft') {
            return response()->json(['message' => 'Cannot update submitted applications'], 403);
        }

        $application->update($validated);

        return response()->json($application);
    }

    /**
     * Submit application
     */
    public function submit(Request $request, Application $application)
    {
        Gate::authorize('update', $application);

        if ($application->status !== 'draft') {
            return response()->json(['message' => 'Application already submitted'], 400);
        }

        $application->update(['status' => 'submitted']);

        return response()->json($application);
    }

    /**
     * Review application (supervisor/admin only)
     */
    public function review(Request $request, Application $application)
    {
        Gate::authorize('review', $application);

        $validated = $request->validate([
            'status' => 'required|in:under_review,approved,rejected',
            'comments' => 'nullable|string',
        ]);

        $application->update([
            'status' => $validated['status'],
            'review_comments' => $validated['comments'] ?? null,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return response()->json($application);
    }

    /**
     * Delete application
     */
    public function destroy(Request $request, Application $application)
    {
        Gate::authorize('delete', $application);

        $application->delete();

        return response()->json(['message' => 'Application deleted successfully']);
    }
}
