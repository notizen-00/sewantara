<?php

namespace App\Http\Controllers\Api\Tenant;

use App\Http\Controllers\Controller;
use App\Modules\Organization\Application\ManageUsers;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    public function index(ManageUsers $users): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $users->listRoles((string) tenant('id')),
        ]);
    }
}
