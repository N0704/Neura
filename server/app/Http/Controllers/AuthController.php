<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'date_of_birth' => ['nullable', 'date'],
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'avatar' => 'https://res.cloudinary.com/dxk5awt0e/image/upload/v1765006791/neura/media/fymfft2fxgervxejiuay.jpg',
        ]);

        $token = $this->issueToken($user, $request);

        return response()->json([
            'message' => 'Đăng ký thành công.',
            'user' => $user->fresh(),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Thông tin đăng nhập không chính xác.'],
            ]);
        }

        $token = $this->issueToken($user, $request);

        return response()->json([
            'message' => 'Đăng nhập thành công.',
            'user' => $user->fresh(),
            'token' => $token,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var ApiToken|null $currentToken */
        $currentToken = $request->attributes->get('auth_token');

        if ($currentToken) {
            $currentToken->delete();
        }

        return response()->json([
            'message' => 'Đăng xuất thành công.',
        ]);
    }

    protected function issueToken(User $user, Request $request): string
    {
        $plainText = Str::random(64);

        $user->tokens()->create([
            'name' => $request->input('device_name') ?? 'default',
            'token' => hash('sha256', $plainText),
            'user_agent' => $request->userAgent(),
            'last_used_at' => now(),
        ]);

        return $plainText;
    }
}

