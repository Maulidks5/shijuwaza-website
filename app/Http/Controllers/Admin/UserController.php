<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\User;
use App\Support\ModuleAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search', '');

        return Inertia::render('Admin/Users/Index', [
            'users' => User::query()
                ->with(['roles:id,name', 'permissions:id,name'])
                ->where('role', '!=', 'member')
                ->whereDoesntHave('roles', fn ($query) => $query->where('name', 'Member'))
                ->when($search, fn ($query) => $query->where(function ($query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                }))
                ->latest()
                ->paginate(10)
                ->through(fn (User $user) => $this->userPayload($user))
                ->withQueryString(),
            'filters' => ['search' => $search],
            'roles' => $this->systemRoles(),
            'modules' => ModuleAccess::modules(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => null,
            'roles' => $this->systemRoles(),
            'modules' => ModuleAccess::modules(),
            'canModifyAccess' => true,
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $this->ensureModulePermissionsExist();

        $data = $request->validated();
        $role = $data['role'];
        $modulePermissions = $this->selectedModulePermissions($data, $role);
        unset($data['role']);
        unset($data['module_permissions']);

        $user = User::create($data);
        $user->syncRoles([$role]);
        $user->syncPermissions($role === 'Super Admin' ? [] : $modulePermissions);
        $user->forceFill(['role' => str($role)->lower()->replace(' ', '_')->toString()])->save();

        return redirect()->route('admin.users.index')->with('success', 'User created.');
    }

    public function edit(User $user): Response
    {
        abort_if($user->isMember(), 404);

        $user->load(['roles:id,name', 'permissions:id,name']);

        return Inertia::render('Admin/Users/Form', [
            'user' => $this->userPayload($user),
            'roles' => $this->systemRoles(),
            'modules' => ModuleAccess::modules(),
            'canModifyAccess' => ! request()->user()->is($user),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        abort_if($user->isMember(), 404);

        $this->ensureModulePermissionsExist();

        $data = $request->validated();
        $isSelf = $request->user()->is($user);
        $role = $isSelf ? $user->roles->first()?->name : $data['role'];
        $modulePermissions = $isSelf ? $user->permissions->pluck('name')->all() : $this->selectedModulePermissions($data, $role);
        unset($data['role']);
        unset($data['module_permissions']);

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $user->update($data);
        $user->syncRoles([$role]);
        $user->syncPermissions($role === 'Super Admin' ? [] : $modulePermissions);
        $user->forceFill(['role' => str($role)->lower()->replace(' ', '_')->toString()])->save();

        return redirect()->route('admin.users.index')->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->hasRole('Super Admin'), 403);
        abort_if($user->isMember(), 404);

        if ($request->user()->is($user)) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted.');
    }

    public function toggleBlock(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->hasRole('Super Admin'), 403);
        abort_if($user->isMember(), 404);

        if ($request->user()->is($user)) {
            return back()->with('error', 'You cannot block your own account.');
        }

        if ($user->is_blocked) {
            $user->forceFill([
                'is_blocked' => false,
                'blocked_at' => null,
                'blocked_by' => null,
                'blocked_reason' => null,
            ])->save();

            return back()->with('success', 'User account unblocked.');
        }

        $user->forceFill([
            'is_blocked' => true,
            'blocked_at' => now(),
            'blocked_by' => $request->user()->id,
            'blocked_reason' => $request->string('reason')->limit(255)->toString() ?: 'Blocked by Super Admin',
        ])->save();

        DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', '!=', $request->session()->getId())
            ->delete();

        return back()->with('success', 'User account blocked and active sessions ended.');
    }

    private function selectedModulePermissions(array $data, string $role): array
    {
        $selected = $data['module_permissions'] ?? [];
        $allowed = ModuleAccess::assignableForRole($role);

        return array_values(array_intersect($selected, $allowed));
    }

    private function ensureModulePermissionsExist(): void
    {
        collect(ModuleAccess::permissions())
            ->each(fn (string $permission) => Permission::findOrCreate($permission, 'web'));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    private function userPayload(User $user): array
    {
        $role = $user->roles->first()?->name;
        $allPermissions = $user->getAllPermissions()->pluck('name')->all();
        $modulePermissions = $role === 'Super Admin' ? ModuleAccess::permissions() : array_values(array_intersect($allPermissions, ModuleAccess::permissions()));

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $role,
            'roles' => $user->roles,
            'module_permissions' => $modulePermissions,
            'is_blocked' => $user->is_blocked,
            'blocked_at' => $user->blocked_at,
            'last_seen_at' => $user->last_seen_at,
            'created_at' => $user->created_at,
        ];
    }

    private function systemRoles()
    {
        return Role::query()
            ->whereIn('name', ['Super Admin', 'Admin', 'Editor'])
            ->get()
            ->sortBy(fn (Role $role) => array_search($role->name, ['Super Admin', 'Admin', 'Editor'], true))
            ->pluck('name')
            ->values();
    }
}
