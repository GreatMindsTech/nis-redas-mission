<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Mission extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'city',
        'country',
        'region',
        'address',
        'contact_email',
        'contact_phone',
        'status',
        'staff_count',
        'created_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function staff(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'mission_staff')->withPivot('position', 'assigned_at', 'removed_at');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function getStaffCountAttribute(): int
    {
        return $this->staff()->whereNull('mission_staff.removed_at')->count();
    }
}
