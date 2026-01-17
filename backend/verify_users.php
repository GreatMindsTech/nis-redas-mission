<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Mock Users Verification ===\n\n";
echo "Total Users: " . App\Models\User::count() . "\n\n";

echo "Users by Role:\n";
echo str_repeat("-", 60) . "\n";

$users = App\Models\User::orderBy('role')->orderBy('email')->get();

foreach ($users as $user) {
    printf(
        "%-15s | %-25s | %s %s\n",
        strtoupper($user->role),
        $user->email,
        $user->first_name,
        $user->last_name
    );
}

echo str_repeat("-", 60) . "\n";
echo "\nAll users have password: 'password'\n";
echo "All users are verified: " . (App\Models\User::where('is_verified', true)->count() === App\Models\User::count() ? "YES" : "NO") . "\n";
