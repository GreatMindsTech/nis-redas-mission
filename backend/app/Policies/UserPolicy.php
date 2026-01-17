<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * View any user
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * View user
     */
    public function view(User $user, User $target): bool
    {
        return $user->id === $target->id || $user->isAdmin();
    }

    /**
     * Update user
     */
    public function update(User $user, User $target): bool
    {
        return $user->id === $target->id || $user->isAdmin();
    }

    /**
     * Update user role
     */
    public function updateRole(User $user, User $target): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Delete user
     */
    public function delete(User $user, User $target): bool
    {
        return $user->isSuperAdmin();
    }
}
