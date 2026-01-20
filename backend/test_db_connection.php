<?php

/**
 * Database Connection Test Script
 *
 * This script tests the PostgreSQL database connection and verifies
 * that all tables and seeded data are accessible.
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Mission;
use App\Models\Application;
use App\Models\AuditLog;
use App\Models\Document;
use App\Models\Report;
use App\Models\Notification;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Event;

echo "========================================\n";
echo "Database Connection Test\n";
echo "========================================\n\n";

// Test 1: Database Connection
echo "Test 1: Testing Database Connection...\n";
try {
    $pdo = DB::connection()->getPdo();
    echo "✓ Database connection successful!\n";
    echo "  Database: " . DB::connection()->getDatabaseName() . "\n";
    echo "  Connection: " . DB::connection()->getName() . "\n\n";
} catch (\Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Test 2: Check Tables Exist
echo "Test 2: Checking Database Tables...\n";
$tables = [
    'users',
    'missions',
    'applications',
    'mission_staff',
    'audit_logs',
    'documents',
    'reports',
    'notifications',
    'conversations',
    'messages',
    'events',
    'personal_access_tokens',
    'migrations'
];

foreach ($tables as $table) {
    try {
        $exists = DB::getSchemaBuilder()->hasTable($table);
        echo $exists ? "✓ Table '$table' exists\n" : "✗ Table '$table' missing\n";
    } catch (\Exception $e) {
        echo "✗ Error checking table '$table': " . $e->getMessage() . "\n";
    }
}
echo "\n";

// Test 3: Check Seeded Users
echo "Test 3: Checking Seeded Users...\n";
try {
    $userCount = User::count();
    echo "✓ Total users: $userCount\n";

    $users = User::all(['id', 'email', 'first_name', 'last_name', 'role']);
    echo "\nUser List:\n";
    echo str_repeat("-", 80) . "\n";
    printf("%-5s %-35s %-15s %-15s %-15s\n", "ID", "Email", "First Name", "Last Name", "Role");
    echo str_repeat("-", 80) . "\n";

    foreach ($users as $user) {
        printf("%-5s %-35s %-15s %-15s %-15s\n",
            $user->id,
            $user->email,
            $user->first_name,
            $user->last_name,
            $user->role
        );
    }
    echo "\n";
} catch (\Exception $e) {
    echo "✗ Error checking users: " . $e->getMessage() . "\n\n";
}

// Test 4: Check Seeded Missions
echo "Test 4: Checking Seeded Missions...\n";
try {
    $missionCount = Mission::count();
    echo "✓ Total missions: $missionCount\n";

    if ($missionCount > 0) {
        $missions = Mission::take(5)->get(['id', 'name', 'code', 'status', 'city', 'country']);
        echo "\nFirst 5 Missions:\n";
        echo str_repeat("-", 100) . "\n";
        printf("%-5s %-30s %-15s %-15s %-15s %-15s\n", "ID", "Name", "Code", "Status", "City", "Country");
        echo str_repeat("-", 100) . "\n";

        foreach ($missions as $mission) {
            printf("%-5s %-30s %-15s %-15s %-15s %-15s\n",
                $mission->id,
                substr($mission->name, 0, 28),
                $mission->code,
                $mission->status,
                $mission->city,
                $mission->country
            );
        }
    }
    echo "\n";
} catch (\Exception $e) {
    echo "✗ Error checking missions: " . $e->getMessage() . "\n\n";
}

// Test 5: Check Mission Staff (using DB query since model doesn't exist)
echo "Test 5: Checking Mission Staff Assignments...\n";
try {
    $staffCount = DB::table('mission_staff')->count();
    echo "✓ Total mission staff assignments: $staffCount\n\n";
} catch (\Exception $e) {
    echo "✗ Error checking mission staff: " . $e->getMessage() . "\n\n";
}

// Test 6: Test Basic CRUD Operations
echo "Test 6: Testing Basic CRUD Operations...\n";
try {
    // Create a test notification
    $notification = Notification::create([
        'user_id' => 1,
        'title' => 'Test Notification',
        'message' => 'This is a test notification from the database connection test.',
        'type' => 'info',
        'is_read' => false,
    ]);
    echo "✓ Created test notification (ID: {$notification->id})\n";

    // Read the notification
    $retrieved = Notification::find($notification->id);
    echo "✓ Retrieved test notification: {$retrieved->title}\n";

    // Update the notification
    $retrieved->is_read = true;
    $retrieved->save();
    echo "✓ Updated test notification (marked as read)\n";

    // Delete the notification
    $retrieved->delete();
    echo "✓ Deleted test notification\n\n";
} catch (\Exception $e) {
    echo "✗ CRUD operations failed: " . $e->getMessage() . "\n\n";
}

// Test 7: Database Information
echo "Test 7: Database Information...\n";
try {
    $version = DB::select("SELECT version()")[0]->version;
    echo "✓ PostgreSQL Version: " . substr($version, 0, 50) . "...\n";

    $currentSchema = DB::select("SELECT current_schema()")[0]->current_schema;
    echo "✓ Current Schema: $currentSchema\n";

    $currentTime = DB::select("SELECT NOW()")[0]->now;
    echo "✓ Database Time: $currentTime\n\n";
} catch (\Exception $e) {
    echo "✗ Error getting database info: " . $e->getMessage() . "\n\n";
}

echo "========================================\n";
echo "Database Connection Test Complete!\n";
echo "========================================\n";
