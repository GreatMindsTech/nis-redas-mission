<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get all users (admin only)
     */
    public function index()
    {
        Gate::authorize('viewAny', User::class);

        $users = User::paginate(15);
        return response()->json($users);
    }

    /**
     * Get single user
     */
    public function show(User $user, Request $request)
    {
        Gate::authorize('view', $user);
        return response()->json($user->load('missions', 'applications'));
    }

    /**
     * Update user
     */
    public function update(Request $request, User $user)
    {
        Gate::authorize('update', $user);

        $validated = $request->validate([
            'first_name' => 'sometimes|string',
            'last_name' => 'sometimes|string',
            'password' => 'sometimes|min:8',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    /**
     * Update user role (super_admin only)
     */
    public function updateRole(Request $request, User $user)
    {
        Gate::authorize('updateRole', $user);

        $validated = $request->validate([
            'role' => 'required|in:user,supervisor,admin,super_admin',
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json($user);
    }

    /**
     * Delete user
     */
    public function destroy(User $user, Request $request)
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
