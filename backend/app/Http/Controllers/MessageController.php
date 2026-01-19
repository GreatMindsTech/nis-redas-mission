<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    /**
     * Get all conversations for the authenticated user
     */
    public function getConversations(Request $request): JsonResponse
    {
        $conversations = Conversation::forUser(Auth::id())
            ->with(['users', 'latestMessage.user'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($conversation) {
                $otherUser = $conversation->getOtherParticipant(Auth::id());
                $unreadCount = $conversation->getUnreadCountForUser(Auth::id());
                
                return [
                    'id' => $conversation->id,
                    'title' => $conversation->title,
                    'type' => $conversation->type,
                    'other_user' => $otherUser ? [
                        'id' => $otherUser->id,
                        'first_name' => $otherUser->first_name,
                        'last_name' => $otherUser->last_name,
                        'email' => $otherUser->email,
                    ] : null,
                    'latest_message' => $conversation->latestMessage,
                    'unread_count' => $unreadCount,
                    'updated_at' => $conversation->updated_at,
                ];
            });

        return response()->json($conversations);
    }

    /**
     * Get or create a conversation with a specific user
     */
    public function getOrCreateConversation(Request $request, $userId): JsonResponse
    {
        $request->validate([
            'user_id' => 'sometimes|exists:users,id',
        ]);

        $currentUserId = Auth::id();
        $otherUserId = $userId;

        // Check if conversation already exists
        $conversation = Conversation::whereHas('users', function ($query) use ($currentUserId) {
            $query->where('user_id', $currentUserId);
        })->whereHas('users', function ($query) use ($otherUserId) {
            $query->where('user_id', $otherUserId);
        })->where('type', 'direct')->first();

        if (!$conversation) {
            // Create new conversation
            $conversation = Conversation::create(['type' => 'direct']);
            $conversation->users()->attach([$currentUserId, $otherUserId]);
        }

        $conversation->load(['users', 'messages.user']);
        $otherUser = $conversation->getOtherParticipant($currentUserId);

        return response()->json([
            'conversation' => [
                'id' => $conversation->id,
                'title' => $conversation->title,
                'type' => $conversation->type,
                'other_user' => $otherUser ? [
                    'id' => $otherUser->id,
                    'first_name' => $otherUser->first_name,
                    'last_name' => $otherUser->last_name,
                    'email' => $otherUser->email,
                ] : null,
                'messages' => $conversation->messages,
                'updated_at' => $conversation->updated_at,
            ]
        ]);
    }

    /**
     * Get messages for a specific conversation
     */
    public function getMessages(Conversation $conversation): JsonResponse
    {
        // Verify user is part of the conversation
        if (!$conversation->users()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $messages = $conversation->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark conversation as read
        $conversation->markAsReadForUser(Auth::id());

        return response()->json($messages);
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        // Verify user is part of the conversation
        if (!$conversation->users()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        $messageData = [
            'conversation_id' => $conversation->id,
            'user_id' => Auth::id(),
            'content' => $validated['content'],
        ];

        // Handle file attachment
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('message-attachments', 'public');
            
            $messageData['attachment_path'] = $path;
            $messageData['attachment_name'] = $file->getClientOriginalName();
            $messageData['attachment_type'] = $file->getMimeType();
            $messageData['attachment_size'] = $file->getSize();
        }

        $message = Message::create($messageData);
        $message->load('user');

        // Update conversation timestamp
        $conversation->touch();

        // Send notification to other participants
        $otherUsers = $conversation->users()->where('user_id', '!=', Auth::id())->get();
        $sender = Auth::user();
        
        foreach ($otherUsers as $otherUser) {
            Notification::create([
                'user_id' => $otherUser->id,
                'type' => 'message',
                'title' => 'New message from ' . $sender->first_name . ' ' . $sender->last_name,
                'message' => substr($validated['content'], 0, 100),
                'action_url' => '/messages?conversation=' . $conversation->id,
                'data' => [
                    'conversation_id' => $conversation->id,
                    'message_id' => $message->id,
                ],
            ]);
        }

        return response()->json([
            'message' => 'Message sent',
            'data' => $message
        ], 201);
    }

    /**
     * Update a message
     */
    public function updateMessage(Request $request, Message $message): JsonResponse
    {
        // Verify user owns the message
        if ($message->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $message->update(['content' => $validated['content']]);
        $message->markAsEdited();
        $message->load('user');

        return response()->json([
            'message' => 'Message updated',
            'data' => $message
        ]);
    }

    /**
     * Delete a message
     */
    public function deleteMessage(Message $message): JsonResponse
    {
        // Verify user owns the message
        if ($message->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete attachment if exists
        if ($message->attachment_path) {
            Storage::disk('public')->delete($message->attachment_path);
        }

        $message->delete();

        return response()->json(['message' => 'Message deleted']);
    }

    /**
     * Mark conversation as read
     */
    public function markAsRead(Conversation $conversation): JsonResponse
    {
        // Verify user is part of the conversation
        if (!$conversation->users()->where('user_id', Auth::id())->exists()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $conversation->markAsReadForUser(Auth::id());

        return response()->json(['message' => 'Conversation marked as read']);
    }

    /**
     * Get unread message count
     */
    public function getUnreadCount(): JsonResponse
    {
        $conversations = Conversation::forUser(Auth::id())->get();
        $totalUnread = 0;

        foreach ($conversations as $conversation) {
            $totalUnread += $conversation->getUnreadCountForUser(Auth::id());
        }

        return response()->json(['count' => $totalUnread]);
    }

    /**
     * Search users for new conversation
     */
    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        $users = User::where('id', '!=', Auth::id())
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                  ->orWhere('last_name', 'like', "%{$query}%")
                  ->orWhere('email', 'like', "%{$query}%");
            })
            ->limit(10)
            ->get(['id', 'first_name', 'last_name', 'email', 'role']);

        return response()->json($users);
    }
}
