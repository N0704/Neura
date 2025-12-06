<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    use HasFactory;

    protected $table = 'media';

    protected $fillable = [
        'post_id',
        'file_url',
        'file_type',
        'cloudinary_public_id',
    ];

    public $timestamps = false;

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    // Relationships
    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
