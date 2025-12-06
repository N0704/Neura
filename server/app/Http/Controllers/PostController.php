<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Media;
use App\Models\Reaction;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

class PostController extends Controller
{
    /**
     * Lấy danh sách bài viết (feed)
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $user = $request->user();

        // Get IDs of friends (accepted friendships)
        $friendIds = \App\Models\Friend::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->orWhere('friend_id', $user->id);
        })
        ->where('status', 'accepted')
        ->get()
        ->map(function ($friend) use ($user) {
            return $friend->user_id === $user->id ? $friend->friend_id : $friend->user_id;
        })
        ->toArray();

        // Get IDs of users being followed
        $followingIds = \App\Models\Follow::where('follower_id', $user->id)
            ->pluck('following_id')
            ->toArray();

        // Build query to get posts
        $posts = Post::with([
                'user:id,username,avatar', 
                'media',
                'reactions', // Load reactions for user_reaction accessor
                'comments' => fn($q) => $q->latest()->with('user:id,username,avatar')
            ])
            ->withCount(['reactions', 'comments'])
            ->where(function ($query) use ($user, $friendIds, $followingIds) {
                // Own posts
                $query->where('user_id', $user->id)
                    // Friends' posts (public or friends privacy)
                    ->orWhere(function ($q) use ($friendIds) {
                        $q->whereIn('user_id', $friendIds)
                          ->whereIn('privacy', ['public', 'friends']);
                    })
                    // Following users' public posts
                    ->orWhere(function ($q) use ($followingIds) {
                        $q->whereIn('user_id', $followingIds)
                          ->where('privacy', 'public');
                    });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $posts
        ]);
    }

    /**
     * Tạo bài viết mới
     */
    public function store(Request $request): JsonResponse
    {
        // Validation
        $request->validate([
            'content'          => 'required|string|max:10000',
            'media_url'        => 'nullable|url|starts_with:https://res.cloudinary.com',
            'media_public_id'  => 'nullable|string',
            'media_type'       => 'nullable|in:image,video',
            'background'       => 'nullable|string|max:100',
            'feeling'          => 'nullable|string|max:50',
            'privacy'          => 'nullable|in:public,friends,private',
        ], [
            'content.required' => 'Nội dung bài viết không được để trống',
            'media_url.url' => 'URL media không hợp lệ',
            'media_url.starts_with' => 'Media phải được upload từ Cloudinary',
        ]);

        DB::beginTransaction();
        try {
            // Tạo bài viết
            $post = Post::create([
                'user_id'    => $request->user()->id,
                'content'    => $request->content,
                'background' => $request->background,
                'feeling'    => $request->feeling,
                'privacy'    => $request->privacy ?? 'public',
            ]);

            // Lưu media URL nếu có (đã upload từ client)
            if ($request->filled('media_url')) {
                Media::create([
                    'post_id'              => $post->id,
                    'file_url'             => $request->media_url,
                    'file_type'            => $request->media_type ?? 'image',
                    'cloudinary_public_id' => $request->media_public_id,
                ]);
            }

            DB::commit();

            // Load lại với media
            $post->load(['user:id,username,avatar', 'media']);

            return response()->json([
                'success' => true,
                'message' => 'Đăng bài thành công!',
                'data'    => $post
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi tạo bài viết', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()->id ?? null
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Đăng bài thất bại: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xem chi tiết bài viết
     */
    public function show(int $id): JsonResponse
    {
        $post = Post::with([
                'user:id,username,avatar',
                'media',
                'comments' => fn($q) => $q->latest()->with('user:id,username,avatar'),
                'reactions.user'
            ])
            ->withCount(['reactions', 'comments'])
            ->find($id);

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy bài viết'], 404);
        }

        return response()->json(['success' => true, 'data' => $post]);
    }

    /**
     * Sửa bài viết
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Bạn không có quyền chỉnh sửa'], 403);
        }

        $request->validate([
            'content'          => 'required|string|max:10000',
            'media_url'        => 'nullable|url|starts_with:https://res.cloudinary.com',
            'media_public_id'  => 'nullable|string',
            'media_type'       => 'nullable|in:image,video',
            'background'       => 'nullable|string|max:100',
            'feeling'          => 'nullable|string|max:50',
            'privacy'          => 'nullable|in:public,friends,private',
            'remove_media'     => 'nullable|array',
            'remove_media.*'   => 'integer|exists:media,id'
        ]);

        DB::beginTransaction();
        try {
            // Cập nhật nội dung
            $post->update($request->only(['content', 'background', 'feeling', 'privacy']));

            // Xóa media cũ nếu có
            if ($request->filled('remove_media')) {
                $post->media()->whereIn('id', $request->remove_media)->delete();
            }

            // Thêm media mới nếu có (đã upload từ client)
            if ($request->filled('media_url')) {
                Media::create([
                    'post_id'              => $post->id,
                    'file_url'             => $request->media_url,
                    'file_type'            => $request->media_type ?? 'image',
                    'cloudinary_public_id' => $request->media_public_id,
                ]);
            }

            DB::commit();

            $post->load('media');

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật bài viết thành công',
                'data'    => $post
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi cập nhật bài viết', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'post_id' => $id
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Cập nhật bài viết thất bại: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa bài viết
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $post = Post::with('media')->find($id);

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy bài viết'], 404);
        }

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Bạn không có quyền xóa'], 403);
        }

        DB::beginTransaction();
        try {
            // Note: Files on Cloudinary are not deleted automatically
            // They can be managed through Cloudinary dashboard or API if needed
            // For now, we only delete the database records
            
            // Xóa bài viết (cascade sẽ xóa media trong DB)
            $post->delete();

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Xóa bài viết thành công']);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Lỗi khi xóa bài viết', [
                'error' => $e->getMessage(),
                'post_id' => $id
            ]);
            return response()->json(['success' => false, 'message' => 'Xóa thất bại'], 500);
        }
    }

    /**
     * Thả reaction
     */
    public function toggleReaction(Request $request, int $postId): JsonResponse
    {
        $request->validate(['type' => 'required|in:like,love,haha,wow,sad,angry']);

        $post = Post::findOrFail($postId);
        $userId = $request->user()->id;

        $reaction = Reaction::where('post_id', $postId)->where('user_id', $userId)->first();
        $userReaction = null;

        if ($reaction) {
            if ($reaction->type === $request->type) {
                // Bỏ reaction
                $reaction->delete();
                $message = 'Đã bỏ reaction';
                $userReaction = null;
            } else {
                // Đổi reaction
                $reaction->update(['type' => $request->type]);
                $message = 'Đã đổi reaction';
                $userReaction = [
                    'type' => $request->type,
                    'liked' => $request->type === 'like'
                ];
            }
        } else {
            // Thêm reaction mới
            Reaction::create([
                'post_id' => $postId,
                'user_id' => $userId,
                'type'    => $request->type
            ]);
            $message = 'Đã thả reaction';
            $userReaction = [
                'type' => $request->type,
                'liked' => $request->type === 'like'
            ];
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'reactions_count' => $post->reactions()->count(),
            'user_reaction' => $userReaction
        ]);
    }

    /**
     * Bình luận
     */
    public function addComment(Request $request, int $postId): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:1000']);

        $post = Post::findOrFail($postId);

        $comment = Comment::create([
            'post_id'  => $postId,
            'user_id'  => $request->user()->id,
            'content'  => $request->content
        ]);

        $comment->load('user:id,username,avatar');

        return response()->json([
            'success' => true,
            'message' => 'Đã bình luận',
            'data'    => $comment,
            'comments_count' => $post->comments()->count()
        ], 201);
    }

    /**
     * Get user photos
     */
    public function userPhotos(Request $request, \App\Models\User $user): JsonResponse
    {
        $currentUser = $request->user();
        $isMe = $currentUser->id === $user->id;
        $isFriend = $currentUser->isFriendWith($user->id);

        // Determine limit based on whether avatar exists
        $hasAvatar = !empty($user->avatar);
        $limit = $hasAvatar ? 8 : 9;

        $photos = $user->media()
            ->whereHas('post', function ($query) use ($isMe, $isFriend) {
                if (!$isMe) {
                    $query->where(function ($q) use ($isFriend) {
                        $q->where('privacy', 'public');
                        if ($isFriend) {
                            $q->orWhere('privacy', 'friends');
                        }
                    });
                }
            })
            ->where('file_type', 'image')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($photo) {
                return [
                    'id' => $photo->id,
                    'file_url' => $photo->file_url,
                    'file_type' => $photo->file_type,
                ];
            });

        if ($hasAvatar) {
            $photos->prepend([
                'id' => 'avatar-' . $user->id,
                'file_url' => $user->avatar,
                'file_type' => 'image',
                'is_avatar' => true,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $photos->values() // Reset keys
        ]);
    }

    /**
     * Get user posts
     */
    public function userPosts(Request $request, \App\Models\User $user): JsonResponse
    {
        $perPage = $request->input('per_page', 10);
        $currentUser = $request->user();
        $isMe = $currentUser->id === $user->id;
        $isFriend = $currentUser->isFriendWith($user->id);

        $posts = Post::with([
                'user:id,username,avatar', 
                'media',
                'reactions',
                'comments' => fn($q) => $q->latest()->with('user:id,username,avatar')
            ])
            ->withCount(['reactions', 'comments'])
            ->where('user_id', $user->id)
            ->where(function ($query) use ($isMe, $isFriend) {
                if (!$isMe) {
                    $query->where(function ($q) use ($isFriend) {
                        $q->where('privacy', 'public');
                        if ($isFriend) {
                            $q->orWhere('privacy', 'friends');
                        }
                    });
                }
            })
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    /**
     * Search posts
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');
        $perPage = $request->input('per_page', 20);

        if (empty($query)) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $posts = Post::with([
                'user:id,username,avatar',
                'media',
                'reactions',
                'comments' => fn($q) => $q->latest()->with('user:id,username,avatar')
            ])
            ->withCount(['reactions', 'comments'])
            ->where(function ($q) use ($query) {
                $q->where('content', 'LIKE', "%{$query}%")
                  ->orWhereHas('user', function ($userQuery) use ($query) {
                      $userQuery->where('username', 'LIKE', "%{$query}%");
                  });
            })
            ->where('privacy', 'public') // Only search public posts
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $posts,
        ]);
    }
}
