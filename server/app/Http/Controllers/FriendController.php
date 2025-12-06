<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FriendController extends Controller
{
    /**
     * Get list of friends
     */
    public function index()
    {
        $user = Auth::user();
        $friends = $user->friends();

        return response()->json([
            'success' => true,
            'data' => $friends->map(function ($friend) {
                return [
                    'id' => $friend->id,
                    'username' => $friend->username,
                    'email' => $friend->email,
                    'avatar' => $friend->avatar,
                    'bio' => $friend->bio,
                ];
            }),
        ]);
    }

    /**
     * Get friends of a specific user
     */
    public function userFriends(User $user)
    {
        $friends = $user->friends();

        return response()->json([
            'success' => true,
            'data' => $friends->map(function ($friend) {
                return [
                    'id' => $friend->id,
                    'username' => $friend->username,
                    'email' => $friend->email,
                    'avatar' => $friend->avatar,
                    'bio' => $friend->bio,
                ];
            }),
        ]);
    }

    /**
     * Get friend requests received
     */
    public function requests()
    {
        $user = Auth::user();
        $requests = $user->friendRequestsReceived()->with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $requests->map(function ($request) {
                return [
                    'id' => $request->id,
                    'user' => [
                        'id' => $request->user->id,
                        'username' => $request->user->username,
                        'email' => $request->user->email,
                        'avatar' => $request->user->avatar,
                        'bio' => $request->user->bio,
                    ],
                    'created_at' => $request->created_at,
                ];
            }),
        ]);
    }

    /**
     * Send friend request
     */
    public function sendRequest(User $user)
    {
        $currentUser = Auth::user();

        // Cannot send friend request to yourself
        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không thể gửi lời mời kết bạn cho chính mình',
            ], 400);
        }

        // Check if already friends
        if ($currentUser->isFriendWith($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã là bạn bè với người này',
            ], 400);
        }

        // Check if request already sent
        if ($currentUser->hasSentFriendRequestTo($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn đã gửi lời mời kết bạn cho người này',
            ], 400);
        }

        // Check if there's a pending request from the other user
        if ($currentUser->hasFriendRequestFrom($user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Người này đã gửi lời mời kết bạn cho bạn. Vui lòng chấp nhận lời mời.',
            ], 400);
        }

        // Create friend request
        $friendRequest = Friend::create([
            'user_id' => $currentUser->id,
            'friend_id' => $user->id,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã gửi lời mời kết bạn',
            'data' => $friendRequest,
        ], 201);
    }

    /**
     * Accept friend request
     */
    public function acceptRequest(User $user)
    {
        $currentUser = Auth::user();

        $friendRequest = Friend::where('user_id', $user->id)
            ->where('friend_id', $currentUser->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy lời mời kết bạn',
            ], 404);
        }

        $friendRequest->update(['status' => 'accepted']);

        return response()->json([
            'success' => true,
            'message' => 'Đã chấp nhận lời mời kết bạn',
            'data' => $friendRequest,
        ]);
    }

    /**
     * Reject friend request
     */
    public function rejectRequest(User $user)
    {
        $currentUser = Auth::user();

        $friendRequest = Friend::where('user_id', $user->id)
            ->where('friend_id', $currentUser->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy lời mời kết bạn',
            ], 404);
        }

        $friendRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã từ chối lời mời kết bạn',
        ]);
    }

    /**
     * Unfriend
     */
    public function unfriend(User $user)
    {
        $currentUser = Auth::user();

        $friendship = Friend::where(function ($query) use ($currentUser, $user) {
            $query->where('user_id', $currentUser->id)
                  ->where('friend_id', $user->id);
        })->orWhere(function ($query) use ($currentUser, $user) {
            $query->where('user_id', $user->id)
                  ->where('friend_id', $currentUser->id);
        })->where('status', 'accepted')->first();

        if (!$friendship) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không phải bạn bè với người này',
            ], 404);
        }

        $friendship->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã hủy kết bạn',
        ]);
    }

    /**
     * Cancel friend request (sent by current user)
     */
    public function cancelRequest(User $user)
    {
        $currentUser = Auth::user();

        $friendRequest = Friend::where('user_id', $currentUser->id)
            ->where('friend_id', $user->id)
            ->where('status', 'pending')
            ->first();

        if (!$friendRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy lời mời kết bạn',
            ], 404);
        }

        $friendRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã hủy lời mời kết bạn',
        ]);
    }

    /**
     * Get friendship status with a user
     */
    public function status(User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => true,
                'data' => [
                    'status' => 'self',
                ],
            ]);
        }

        // Check if friends
        if ($currentUser->isFriendWith($user->id)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'status' => 'friends',
                ],
            ]);
        }

        // Check if current user sent request
        if ($currentUser->hasSentFriendRequestTo($user->id)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'status' => 'request_sent',
                ],
            ]);
        }

        // Check if current user received request
        if ($currentUser->hasFriendRequestFrom($user->id)) {
            return response()->json([
                'success' => true,
                'data' => [
                    'status' => 'request_received',
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'status' => 'none',
            ],
        ]);
    }
}
