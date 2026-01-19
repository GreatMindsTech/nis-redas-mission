<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Get all events for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        $query = Event::forUser(Auth::id())->with('user');

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->inDateRange($request->start_date, $request->end_date);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        $events = $query->orderBy('start_date', 'asc')->get();

        return response()->json($events);
    }

    /**
     * Get a specific event
     */
    public function show(Event $event): JsonResponse
    {
        // Verify user owns the event or is an attendee
        if ($event->user_id !== Auth::id() && !in_array(Auth::id(), $event->attendees ?? [])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->load('user');
        return response()->json($event);
    }

    /**
     * Create a new event
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'all_day' => 'boolean',
            'category' => 'required|in:meeting,deadline,mission,personal,other',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'is_recurring' => 'boolean',
            'recurrence_pattern' => 'nullable|string|in:daily,weekly,monthly,yearly',
            'recurrence_end_date' => 'nullable|date|after:start_date',
            'attendees' => 'nullable|array',
            'attendees.*' => 'exists:users,id',
            'reminder_enabled' => 'boolean',
            'reminder_minutes_before' => 'nullable|integer|min:0',
        ]);

        $validated['user_id'] = Auth::id();

        $event = Event::create($validated);
        $event->load('user');

        // Send notifications to attendees
        if (!empty($validated['attendees'])) {
            $creator = Auth::user();
            foreach ($validated['attendees'] as $attendeeId) {
                if ($attendeeId != Auth::id()) {
                    Notification::create([
                        'user_id' => $attendeeId,
                        'type' => 'event',
                        'title' => 'New Event Invitation',
                        'message' => $creator->first_name . ' ' . $creator->last_name . ' invited you to: ' . $validated['title'],
                        'action_url' => '/calendar?event=' . $event->id,
                        'data' => ['event_id' => $event->id],
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Event created successfully',
            'data' => $event
        ], 201);
    }

    /**
     * Update an event
     */
    public function update(Request $request, Event $event): JsonResponse
    {
        // Verify user owns the event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'all_day' => 'boolean',
            'category' => 'sometimes|required|in:meeting,deadline,mission,personal,other',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'is_recurring' => 'boolean',
            'recurrence_pattern' => 'nullable|string|in:daily,weekly,monthly,yearly',
            'recurrence_end_date' => 'nullable|date|after:start_date',
            'attendees' => 'nullable|array',
            'attendees.*' => 'exists:users,id',
            'reminder_enabled' => 'boolean',
            'reminder_minutes_before' => 'nullable|integer|min:0',
        ]);

        $event->update($validated);
        $event->load('user');

        // Notify attendees of changes
        if (isset($validated['attendees'])) {
            $creator = Auth::user();
            foreach ($validated['attendees'] as $attendeeId) {
                if ($attendeeId != Auth::id()) {
                    Notification::create([
                        'user_id' => $attendeeId,
                        'type' => 'event',
                        'title' => 'Event Updated',
                        'message' => $creator->first_name . ' ' . $creator->last_name . ' updated the event: ' . $event->title,
                        'action_url' => '/calendar?event=' . $event->id,
                        'data' => ['event_id' => $event->id],
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Event updated successfully',
            'data' => $event
        ]);
    }

    /**
     * Delete an event
     */
    public function destroy(Event $event): JsonResponse
    {
        // Verify user owns the event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    /**
     * Get upcoming events
     */
    public function upcoming(): JsonResponse
    {
        $events = Event::forUser(Auth::id())
            ->upcoming()
            ->limit(10)
            ->get();

        return response()->json($events);
    }

    /**
     * Get events statistics
     */
    public function statistics(): JsonResponse
    {
        $userId = Auth::id();

        $stats = [
            'total_events' => Event::forUser($userId)->count(),
            'upcoming_events' => Event::forUser($userId)->upcoming()->count(),
            'events_by_category' => Event::forUser($userId)
                ->selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category'),
            'events_this_month' => Event::forUser($userId)
                ->whereMonth('start_date', now()->month)
                ->whereYear('start_date', now()->year)
                ->count(),
        ];

        return response()->json($stats);
    }
}
