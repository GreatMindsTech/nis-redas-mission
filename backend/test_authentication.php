<?php

/**
 * Authentication Testing Script
 * Tests login functionality with different user roles
 */

$baseUrl = 'http://127.0.0.1:8000/api';

// Test users
$testUsers = [
    [
        'role' => 'Super Admin',
        'email' => 'super_admin@example.com',
        'password' => 'password'
    ],
    [
        'role' => 'Admin',
        'email' => 'admin@example.com',
        'password' => 'password'
    ],
    [
        'role' => 'Supervisor',
        'email' => 'supervisor@example.com',
        'password' => 'password'
    ],
    [
        'role' => 'User',
        'email' => 'user@example.com',
        'password' => 'password'
    ]
];

echo "=== Authentication Testing ===\n\n";
echo "Testing login endpoint: {$baseUrl}/login\n";
echo str_repeat("=", 80) . "\n\n";

$results = [];

foreach ($testUsers as $testUser) {
    echo "Testing {$testUser['role']} Login...\n";
    echo str_repeat("-", 80) . "\n";
    
    // Prepare login request
    $data = [
        'email' => $testUser['email'],
        'password' => $testUser['password']
    ];
    
    $ch = curl_init($baseUrl . '/login');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    $responseData = json_decode($response, true);
    
    if ($httpCode === 200 && isset($responseData['token'])) {
        echo "✅ SUCCESS\n";
        echo "   Email: {$testUser['email']}\n";
        echo "   User: {$responseData['user']['first_name']} {$responseData['user']['last_name']}\n";
        echo "   Role: {$responseData['user']['role']}\n";
        echo "   Token: " . substr($responseData['token'], 0, 20) . "...\n";
        echo "   Verified: " . ($responseData['user']['is_verified'] ? 'Yes' : 'No') . "\n";
        
        $results[] = [
            'role' => $testUser['role'],
            'status' => 'SUCCESS',
            'token' => $responseData['token'],
            'user' => $responseData['user']
        ];
    } else {
        echo "❌ FAILED\n";
        echo "   HTTP Code: {$httpCode}\n";
        echo "   Response: {$response}\n";
        
        $results[] = [
            'role' => $testUser['role'],
            'status' => 'FAILED',
            'error' => $response
        ];
    }
    
    echo "\n";
}

echo str_repeat("=", 80) . "\n";
echo "Testing /me endpoint (authenticated user info)\n";
echo str_repeat("=", 80) . "\n\n";

// Test /me endpoint with one of the tokens
foreach ($results as $result) {
    if ($result['status'] === 'SUCCESS') {
        echo "Testing /me with {$result['role']} token...\n";
        
        $ch = curl_init($baseUrl . '/me');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $result['token'],
            'Accept: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $userData = json_decode($response, true);
            echo "✅ SUCCESS - Retrieved user data\n";
            echo "   Name: {$userData['first_name']} {$userData['last_name']}\n";
            echo "   Email: {$userData['email']}\n";
            echo "   Role: {$userData['role']}\n";
        } else {
            echo "❌ FAILED - HTTP Code: {$httpCode}\n";
        }
        
        echo "\n";
        break; // Only test with first successful login
    }
}

echo str_repeat("=", 80) . "\n";
echo "Testing Invalid Credentials\n";
echo str_repeat("=", 80) . "\n\n";

$invalidData = [
    'email' => 'user@example.com',
    'password' => 'wrongpassword'
];

$ch = curl_init($baseUrl . '/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($invalidData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 422) {
    echo "✅ SUCCESS - Invalid credentials properly rejected\n";
    echo "   HTTP Code: {$httpCode}\n";
    echo "   Response: {$response}\n";
} else {
    echo "❌ FAILED - Expected 422, got {$httpCode}\n";
}

echo "\n" . str_repeat("=", 80) . "\n";
echo "Summary\n";
echo str_repeat("=", 80) . "\n\n";

$successCount = count(array_filter($results, fn($r) => $r['status'] === 'SUCCESS'));
$totalCount = count($results);

echo "Total Tests: {$totalCount}\n";
echo "Successful: {$successCount}\n";
echo "Failed: " . ($totalCount - $successCount) . "\n\n";

if ($successCount === $totalCount) {
    echo "🎉 All authentication tests passed!\n";
} else {
    echo "⚠️  Some tests failed. Please review the output above.\n";
}

echo "\n";
