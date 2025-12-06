<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'content',
        'image',
        'background',
        'feeling',
        'privacy',
    ];

    protected $appends = [
        'reactions_count',
        'comments_count',
        'user_info',
        'media_urls',
        'user_reaction',
    ];

    public $timestamps = false;

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    // Accessors
    public function getReactionsCountAttribute(): int
    {
        return $this->reactions()->count();
    }

    public function getCommentsCountAttribute(): int
    {
        return $this->comments()->count();
    }

    public function getUserInfoAttribute(): array
    {
        return [
            'id' => $this->user->id,
            'username' => $this->user->username,
            'avatar' => $this->user->avatar,
        ];
    }

    public function getMediaUrlsAttribute(): array
    {
        return $this->media->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->file_url,
                'type' => $media->file_type,
            ];
        })->toArray();
    }

    public function getUserReactionAttribute(): ?array
    {
        try {
            // Use auth() instead of auth('sanctum')
            $user = auth()->user();
            
            if (!$user) {
                return null;
            }

            // Check if reactions are already loaded to avoid N+1
            if ($this->relationLoaded('reactions')) {
                $reaction = $this->reactions->where('user_id', $user->id)->first();
            } else {
                $reaction = $this->reactions()->where('user_id', $user->id)->first();
            }

            if (!$reaction) {
                return null;
            }

            return [
                'type' => $reaction->type,
                'liked' => $reaction->type === 'like',
            ];
        } catch (\Exception $e) {
            \Log::error('Error getting user reaction: ' . $e->getMessage());
            return null;
        }
    }
}
