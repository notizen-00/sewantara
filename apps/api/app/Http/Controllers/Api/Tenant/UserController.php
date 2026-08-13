<?php

namespace App\Http\Controllers\Api\Tenant;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tenant\AssignUserRoleRequest;
use App\Http\Requests\Tenant\StoreUserRequest;
use App\Http\Requests\Tenant\UpdateUserRequest;
use App\Models\User;
use App\Modules\Organization\Application\ManageUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function index(
        Request $request,
        ManageUsers $users,
    ): JsonResponse {
        $result = $users->paginate(
            search: $request->string('search')->toString() ?: null,
            isActive: $request->has('is_active')
                ? $request->boolean('is_active')
                : null,
            perPage: $request->integer('per_page', 20),
        );

        return response()->json(['success' => true, 'data' => $result]);
    }

    public function store(
        StoreUserRequest $request,
        ManageUsers $users,
    ): JsonResponse {
        $user = $users->create((string) tenant('id'), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil ditambahkan.',
            'data' => $user,
        ], 201);
    }

    public function show(
        ManageUsers $users,
        User $user,
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'data' => $users->detail($user),
        ]);
    }

    public function update(
        UpdateUserRequest $request,
        ManageUsers $users,
        User $user,
    ): JsonResponse {
        $user = $users->update($user, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil diperbarui.',
            'data' => $user,
        ]);
    }

    public function destroy(
        Request $request,
        ManageUsers $users,
        User $user,
    ): JsonResponse {
        if ($request->user()?->getKey() === $user->getKey()) {
            throw ValidationException::withMessages([
                'id' => ['Akun yang sedang digunakan tidak dapat dihapus.'],
            ]);
        }

        $users->delete($user);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna berhasil dihapus.',
            'data' => null,
        ]);
    }

    public function assignRole(
        AssignUserRoleRequest $request,
        ManageUsers $users,
        User $user,
    ): JsonResponse {
        $validated = $request->validated();
        $user = $users->assignRole($user, (int) $validated['role_id'], $validated['branch_id'] ?? null);

        return response()->json([
            'success' => true,
            'message' => 'Role pengguna berhasil ditetapkan.',
            'data' => $user,
        ]);
    }
}
