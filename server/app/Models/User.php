<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'date_of_birth',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'date_of_birth' => 'date',
        ];
    }

    protected $appends = [
        'name',
    ];

    public function getNameAttribute(): ?string
    {
        return $this->attributes['username'] ?? null;
    }

    public function tokens(): HasMany
    {
        return $this->hasMany(ApiToken::class);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // Friend relationships
    public function friendsInitiated(): HasMany
    {
        return $this->hasMany(Friend::class, 'user_id');
    }

    public function friendsReceived(): HasMany
    {
        return $this->hasMany(Friend::class, 'friend_id');
    }

    // Get all accepted friends
    public function friends()
    {
        $friendsInitiated = $this->friendsInitiated()
            ->where('status', 'accepted')
            ->with('friend')
            ->get()
            ->pluck('friend');

        $friendsReceived = $this->friendsReceived()
            ->where('status', 'accepted')
            ->with('user')
            ->get()
            ->pluck('user');

        return $friendsInitiated->merge($friendsReceived);
    }

    // Get pending friend requests sent
    public function friendRequestsSent(): HasMany
    {
        return $this->hasMany(Friend::class, 'user_id')->where('status', 'pending');
    }

    // Get pending friend requests received
    public function friendRequestsReceived(): HasMany
    {
        return $this->hasMany(Friend::class, 'friend_id')->where('status', 'pending');
    }

    // Follow relationships
    public function followers(): HasMany
    {
        return $this->hasMany(Follow::class, 'following_id');
    }

    public function following(): HasMany
    {
        return $this->hasMany(Follow::class, 'follower_id');
    }

    // Helper methods
    public function isFriendWith($userId): bool
    {
        return Friend::where(function ($query) use ($userId) {
            $query->where('user_id', $this->id)
                  ->where('friend_id', $userId);
        })->orWhere(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                  ->where('friend_id', $this->id);
        })->where('status', 'accepted')->exists();
    }

    public function hasFriendRequestFrom($userId): bool
    {
        return Friend::where('user_id', $userId)
            ->where('friend_id', $this->id)
            ->where('status', 'pending')
            ->exists();
    }

    public function hasSentFriendRequestTo($userId): bool
    {
        return Friend::where('user_id', $this->id)
            ->where('friend_id', $userId)
            ->where('status', 'pending')
            ->exists();
    }

    public function isFollowing($userId): bool
    {
        return Follow::where('follower_id', $this->id)
            ->where('following_id', $userId)
            ->exists();
    }

    public function isFollowedBy($userId): bool
    {
        return Follow::where('follower_id', $userId)
            ->where('following_id', $this->id)
            ->exists();
    }

    public function media()
    {
        return $this->hasManyThrough(Media::class, Post::class);
    }
}
