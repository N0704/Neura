<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth.token')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Posts
    Route::apiResource('posts', PostController::class);
    Route::get('posts/search/query', [PostController::class, 'search']);
    Route::post('posts/{post}/reaction', [PostController::class, 'toggleReaction']);
    Route::post('posts/{post}/comment', [PostController::class, 'addComment']);
    Route::get('/users/{user}/photos', [PostController::class, 'userPhotos']);
    Route::get('/users/{user}/posts', [PostController::class, 'userPosts']);

    // Friends
    Route::get('/friends', [FriendController::class, 'index']);
    Route::get('/users/{user}/friends', [FriendController::class, 'userFriends']);
    Route::get('/friends/requests', [FriendController::class, 'requests']);
    Route::get('/friends/status/{user}', [FriendController::class, 'status']);
    Route::post('/friends/request/{user}', [FriendController::class, 'sendRequest']);
    Route::post('/friends/accept/{user}', [FriendController::class, 'acceptRequest']);
    Route::post('/friends/reject/{user}', [FriendController::class, 'rejectRequest']);
    Route::delete('/friends/cancel/{user}', [FriendController::class, 'cancelRequest']);
    Route::delete('/friends/{user}', [FriendController::class, 'unfriend']);

    // Follows
    Route::get('/followers', [FollowController::class, 'followers']);
    Route::get('/following', [FollowController::class, 'following']);
    Route::get('/follow/status/{user}', [FollowController::class, 'status']);
    Route::post('/follow/{user}', [FollowController::class, 'follow']);
    Route::delete('/follow/{user}', [FollowController::class, 'unfollow']);

    // Users
    Route::get('/users/search', [UserController::class, 'search']);
    Route::get('/users/suggestions', [UserController::class, 'suggestions']);
    Route::get('/users/{user}', [UserController::class, 'show']);

});
