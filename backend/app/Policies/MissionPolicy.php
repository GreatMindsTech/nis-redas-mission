<?php

namespace App\Policies;

use App\Models\Mission;
use App\Models\User;

class MissionPolicy
{
    /**
     * Create mission
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * View mission
     */
    public function view(User $user, Mission $mission): bool
    {
        return true;
    }

    /**
     * Update mission
     */
    public function update(User $user, Mission $mission): bool
    {
        return $user->isAdmin();
    }

    /**
     * Delete mission
     */
    public function delete(User $user, Mission $mission): bool
    {
        return $user->isSuperAdmin();
    }
}
