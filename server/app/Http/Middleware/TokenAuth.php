<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TokenAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $incomingToken = $request->bearerToken();

        if (! $incomingToken) {
            return $this->unauthorizedResponse();
        }

        $tokenRecord = ApiToken::query()
            ->with('user')
            ->where('token', hash('sha256', $incomingToken))
            ->first();

        if (! $tokenRecord || ! $tokenRecord->user) {
            return $this->unauthorizedResponse();
        }

        $tokenRecord->forceFill([
            'last_used_at' => now(),
        ])->save();

        Auth::setUser($tokenRecord->user);
        $request->attributes->set('auth_token', $tokenRecord);

        return $next($request);
    }

    protected function unauthorizedResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Token không hợp lệ hoặc đã hết hạn.',
        ], 401);
    }
}

