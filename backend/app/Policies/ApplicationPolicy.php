<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * View application
     */
    public function view(User $user, Application $application): bool
    {
        return $user->id === $application->user_id || $user->isSupervisor();
    }

    /**
     * Update application
     */
    public function update(User $user, Application $application): bool
    {
        return $user->id === $application->user_id && $application->status === 'draft';
    }

    /**
     * Review application
     */
    public function review(User $user, Application $application): bool
    {
        return $user->isSupervisor();
    }

    /**
     * Delete application
     */
    public function delete(User $user, Application $application): bool
    {
        return $user->id === $application->user_id || $user->isSuperAdmin();
    }
}
