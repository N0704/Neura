<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    /**
     * Follow a user
     */
    public function follow(User $user)
    {
        $currentUser = Auth::user();

        // Cannot follow yourself
        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không thể theo dõi chính mình',
            ], 400);
        }

        // Check if already following
        if ($currentUser->isFollowing($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã theo dõi người này',
            ], 400);
        }

        // Create follow relationship
        $follow = Follow::create([
            'follower_id' => $currentUser->id,
            'following_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã theo dõi người dùng',
            'data' => $follow,
        ], 201);
    }

    /**
     * Unfollow a user
     */
    public function unfollow(User $user)
    {
        $currentUser = Auth::user();

        $follow = Follow::where('follower_id', $currentUser->id)
            ->where('following_id', $user->id)
            ->first();

        if (!$follow) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn chưa theo dõi người này',
            ], 404);
        }

        $follow->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã bỏ theo dõi',
        ]);
    }

    /**
     * Get list of followers
     */
    public function followers()
    {
        $user = Auth::user();
        $followers = $user->followers()->with('follower')->get();

        return response()->json([
            'success' => true,
            'data' => $followers->map(function ($follow) {
                return [
                    'id' => $follow->follower->id,
                    'username' => $follow->follower->username,
                    'email' => $follow->follower->email,
                    'avatar' => $follow->follower->avatar,
                    'bio' => $follow->follower->bio,
                    'followed_at' => $follow->created_at,
                ];
            }),
        ]);
    }

    /**
     * Get list of users being followed
     */
    public function following()
    {
        $user = Auth::user();
        $following = $user->following()->with('following')->get();

        return response()->json([
            'success' => true,
            'data' => $following->map(function ($follow) {
                return [
                    'id' => $follow->following->id,
                    'username' => $follow->following->username,
                    'email' => $follow->following->email,
                    'avatar' => $follow->following->avatar,
                    'bio' => $follow->following->bio,
                    'followed_at' => $follow->created_at,
                ];
            }),
        ]);
    }

    /**
     * Get follow status with a user
     */
    public function status(User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => true,
                'data' => [
                    'is_following' => false,
                    'is_followed_by' => false,
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'is_following' => $currentUser->isFollowing($user->id),
                'is_followed_by' => $currentUser->isFollowedBy($user->id),
            ],
        ]);
    }
}
