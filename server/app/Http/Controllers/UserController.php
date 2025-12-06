<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Search users
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $perPage = $request->input('per_page', 20);
        $currentUser = Auth::user();

        if (empty($query)) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $users = User::where('id', '!=', $currentUser->id)
            ->where(function ($q) use ($query) {
                $q->where('username', 'LIKE', "%{$query}%")
                  ->orWhere('email', 'LIKE', "%{$query}%");
            })
            ->select('id', 'username', 'email', 'avatar', 'bio')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Get user suggestions (people you may know)
     */
    public function suggestions()
    {
        $currentUser = Auth::user();
        
        // Get IDs of current friends
        $friendIds = \App\Models\Friend::where(function ($query) use ($currentUser) {
            $query->where('user_id', $currentUser->id)
                  ->orWhere('friend_id', $currentUser->id);
        })
        ->where('status', 'accepted')
        ->get()
        ->map(function ($friend) use ($currentUser) {
            return $friend->user_id === $currentUser->id ? $friend->friend_id : $friend->user_id;
        })
        ->toArray();

        // Get IDs of pending requests (sent or received)
        $pendingIds = \App\Models\Friend::where(function ($query) use ($currentUser) {
            $query->where('user_id', $currentUser->id)
                  ->orWhere('friend_id', $currentUser->id);
        })
        ->where('status', 'pending')
        ->get()
        ->map(function ($friend) use ($currentUser) {
            return $friend->user_id === $currentUser->id ? $friend->friend_id : $friend->user_id;
        })
        ->toArray();

        // Exclude current user, friends, and pending requests
        $excludeIds = array_merge([$currentUser->id], $friendIds, $pendingIds);

        // Get random users (simple suggestion algorithm)
        $suggestions = User::whereNotIn('id', $excludeIds)
            ->select('id', 'username', 'email', 'avatar', 'bio')
            ->inRandomOrder()
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $suggestions,
        ]);
    }

    /**
     * Get user profile
     */
    public function show(User $user)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'created_at' => $user->created_at,
                'friends_count' => $user->friends()->count(),
            ],
        ]);
    }
}
