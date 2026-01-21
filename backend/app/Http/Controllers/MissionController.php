<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;

class MissionController extends Controller
{
    /**
     * Get all missions with optimized queries and caching
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $perPage = min($perPage, 100); // Max 100 items per page
        
        // Build query with eager loading to prevent N+1 queries
        $query = Mission::with(['creator:id,first_name,last_name,email'])
            ->withCount('staff')
            ->select([
                'id', 'name', 'code', 'description', 'city', 'country', 
                'region', 'address', 'contact_email', 'contact_phone', 
                'status', 'created_by', 'created_at', 'updated_at'
            ]);
        
        // Apply filters if provided
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }
        
        if ($request->has('region')) {
            $query->where('region', $request->input('region'));
        }
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%");
            });
        }
        
        $missions = $query->paginate($perPage);
        
        // Add cache headers
        return response()->json($missions)
            ->header('Cache-Control', 'public, max-age=300'); // 5 minutes
    }

    /**
     * Get single mission
     */
    public function show(Mission $mission)
    {
        return response()->json($mission->load('creator', 'staff', 'applications'));
    }

    /**
     * Create new mission (admin/super_admin only)
     */
    public function store(Request $request)
    {
        Gate::authorize('create', Mission::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:missions|max:50',
            'description' => 'nullable|string',
            'city' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'region' => 'required|string|max:255',
            'address' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
        ]);

        $mission = Mission::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($mission, 201);
    }

    /**
     * Update mission
     */
    public function update(Request $request, Mission $mission)
    {
        Gate::authorize('update', $mission);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'city' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:255',
            'region' => 'sometimes|string|max:255',
            'address' => 'nullable|string',
            'contact_email' => 'nullable|email',
            'contact_phone' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,pending',
        ]);

        $mission->update($validated);

        return response()->json($mission);
    }

    /**
     * Delete mission
     */
    public function destroy(Request $request, Mission $mission)
    {
        Gate::authorize('delete', $mission);

        $mission->delete();

        return response()->json(['message' => 'Mission deleted successfully']);
    }

    /**
     * Add staff to mission
     */
    public function addStaff(Request $request, Mission $mission)
    {
        Gate::authorize('update', $mission);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'position' => 'nullable|string',
        ]);

        $mission->staff()->attach($validated['user_id'], [
            'position' => $validated['position'] ?? null,
            'assigned_at' => now(),
        ]);

        return response()->json(['message' => 'Staff added successfully']);
    }

    /**
     * Remove staff from mission
     */
    public function removeStaff(Request $request, Mission $mission)
    {
        Gate::authorize('update', $mission);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $mission->staff()->detach($validated['user_id']);

        return response()->json(['message' => 'Staff removed successfully']);
    }

    /**
     * Get all mission staff users
     */
    public function getMissionStaff()
    {
        $staff = DB::table('mission_staff')
            ->join('users', 'mission_staff.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.email',
                'users.role',
                'mission_staff.position',
                'mission_staff.assigned_at'
            )
            ->whereNull('mission_staff.removed_at')
            ->get();

        return response()->json($staff);
    }
}
