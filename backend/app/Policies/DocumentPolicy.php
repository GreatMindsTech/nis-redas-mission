<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    /**
     * Determine if the user can view any documents
     */
    public function viewAny(User $user): bool
    {
        // Admins and super admins can view all documents
        // Regular users can view their own documents (handled in controller)
        return true;
    }

    /**
     * Determine if the user can view the document
     */
    public function view(User $user, Document $document): bool
    {
        // Admins and super admins can view any document
        if ($user->isAdmin()) {
            return true;
        }

        // Users can only view their own documents
        return $user->id === $document->user_id;
    }

    /**
     * Determine if the user can create documents
     */
    public function create(User $user): bool
    {
        // Only users with 'user' role can upload documents
        return $user->role === 'user';
    }

    /**
     * Determine if the user can update the document
     */
    public function update(User $user, Document $document): bool
    {
        // Users can only update their own pending documents
        return $user->id === $document->user_id && $document->isPending();
    }

    /**
     * Determine if the user can delete the document
     */
    public function delete(User $user, Document $document): bool
    {
        // Admins can delete any document
        if ($user->isAdmin()) {
            return true;
        }

        // Users can only delete their own pending documents
        return $user->id === $document->user_id && $document->isPending();
    }

    /**
     * Determine if the user can approve documents
     */
    public function approve(User $user): bool
    {
        // Only admins and super admins can approve documents
        return $user->isAdmin();
    }

    /**
     * Determine if the user can reject documents
     */
    public function reject(User $user): bool
    {
        // Only admins and super admins can reject documents
        return $user->isAdmin();
    }

    /**
     * Determine if the user can download the document
     */
    public function download(User $user, Document $document): bool
    {
        // Admins can download any document
        if ($user->isAdmin()) {
            return true;
        }

        // Users can only download their own approved documents
        return $user->id === $document->user_id;
    }
}
