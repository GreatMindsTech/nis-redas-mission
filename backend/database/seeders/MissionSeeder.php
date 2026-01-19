<?php

namespace Database\Seeders;

use App\Models\Mission;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first super admin or admin user to assign as creator
        $creator = User::whereIn('role', ['super_admin', 'admin'])->first();
        
        if (!$creator) {
            $this->command->error('No admin user found. Please run UserSeeder first.');
            return;
        }

        // Load missions data from JSON file
        $jsonPath = database_path('data/missions.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->warn('missions.json not found. Creating sample missions...');
            $this->createSampleMissions($creator);
            return;
        }

        $missionsData = json_decode(File::get($jsonPath), true);
        
        if (!$missionsData) {
            $this->command->error('Failed to parse missions.json');
            return;
        }

        $this->command->info('Seeding missions from JSON file...');
        
        $created = 0;
        $updated = 0;
        
        foreach ($missionsData as $missionData) {
            $mission = Mission::updateOrCreate(
                ['code' => $missionData['code']], // Find by code
                [
                    'name' => $missionData['name'],
                    'description' => $missionData['description'] ?? "Nigerian diplomatic mission in {$missionData['city']}, {$missionData['country']}",
                    'city' => $missionData['city'],
                    'country' => $missionData['country'],
                    'region' => $missionData['region'],
                    'address' => $missionData['address'] ?? null,
                    'contact_email' => $missionData['contact_email'] ?? null,
                    'contact_phone' => $missionData['contact_phone'] ?? null,
                    'status' => $missionData['status'] ?? 'active',
                    'staff_count' => $missionData['staff_count'] ?? rand(10, 30),
                    'created_by' => $creator->id,
                ]
            );
            
            if ($mission->wasRecentlyCreated) {
                $created++;
            } else {
                $updated++;
            }
        }

        $this->command->info("Successfully processed " . count($missionsData) . " missions!");
        $this->command->info("Created: {$created}, Updated: {$updated}");
    }

    /**
     * Create sample missions if JSON file doesn't exist
     */
    private function createSampleMissions(User $creator): void
    {
        $sampleMissions = [
            [
                'name' => 'Nigerian High Commission',
                'code' => 'NHC-GHA',
                'description' => 'Nigerian diplomatic mission in Accra, Ghana',
                'city' => 'Accra',
                'country' => 'Ghana',
                'region' => 'West Africa',
                'address' => 'No. 9 Josif Broz Tito Avenue, East Legon',
                'contact_email' => 'info@nigeriahcaccra.org',
                'contact_phone' => '+233 302 774 700',
                'status' => 'active',
                'staff_count' => 24,
            ],
            [
                'name' => 'Nigerian High Commission',
                'code' => 'NHC-ZAF',
                'description' => 'Nigerian diplomatic mission in Pretoria, South Africa',
                'city' => 'Pretoria',
                'country' => 'South Africa',
                'region' => 'Southern Africa',
                'address' => '307 Brooks Street, Menlo Park',
                'contact_email' => 'info@nigeriahc.co.za',
                'contact_phone' => '+27 12 342 0630',
                'status' => 'active',
                'staff_count' => 28,
            ],
            [
                'name' => 'Nigerian Embassy',
                'code' => 'NEM-ETH',
                'description' => 'Nigerian diplomatic mission in Addis Ababa, Ethiopia',
                'city' => 'Addis Ababa',
                'country' => 'Ethiopia',
                'region' => 'East Africa',
                'address' => 'Bole Sub City, Woreda 03',
                'contact_email' => 'info@nigeriaembassyethiopia.org',
                'contact_phone' => '+251 11 551 3001',
                'status' => 'active',
                'staff_count' => 18,
            ],
            [
                'name' => 'Nigerian High Commission',
                'code' => 'NHC-KEN',
                'description' => 'Nigerian diplomatic mission in Nairobi, Kenya',
                'city' => 'Nairobi',
                'country' => 'Kenya',
                'region' => 'East Africa',
                'address' => 'Lenana Road, Hurlingham',
                'contact_email' => 'info@nigeriahckenya.org',
                'contact_phone' => '+254 20 272 3014',
                'status' => 'active',
                'staff_count' => 22,
            ],
            [
                'name' => 'Nigerian Embassy',
                'code' => 'NEM-EGY',
                'description' => 'Nigerian diplomatic mission in Cairo, Egypt',
                'city' => 'Cairo',
                'country' => 'Egypt',
                'region' => 'North Africa',
                'address' => '13 Geziret El Arab Street, Mohandessin',
                'contact_email' => 'info@nigeriaembassyegypt.org',
                'contact_phone' => '+20 2 3761 0823',
                'status' => 'active',
                'staff_count' => 20,
            ],
            [
                'name' => 'Nigerian High Commission',
                'code' => 'NHC-GBR',
                'description' => 'Nigerian diplomatic mission in London, United Kingdom',
                'city' => 'London',
                'country' => 'United Kingdom',
                'region' => 'Europe',
                'address' => '9 Northumberland Avenue',
                'contact_email' => 'info@nigeriahc.org.uk',
                'contact_phone' => '+44 20 7839 1244',
                'status' => 'active',
                'staff_count' => 35,
            ],
            [
                'name' => 'Nigerian Embassy',
                'code' => 'NEM-FRA',
                'description' => 'Nigerian diplomatic mission in Paris, France',
                'city' => 'Paris',
                'country' => 'France',
                'region' => 'Europe',
                'address' => '173 Avenue Victor Hugo',
                'contact_email' => 'info@ambassade-nigeria.fr',
                'contact_phone' => '+33 1 47 04 68 65',
                'status' => 'active',
                'staff_count' => 30,
            ],
            [
                'name' => 'Nigerian Embassy',
                'code' => 'NEM-DEU',
                'description' => 'Nigerian diplomatic mission in Berlin, Germany',
                'city' => 'Berlin',
                'country' => 'Germany',
                'region' => 'Europe',
                'address' => 'Neue Jakobstrasse 4',
                'contact_email' => 'info@nigerianembassy.de',
                'contact_phone' => '+49 30 212 359 0',
                'status' => 'active',
                'staff_count' => 26,
            ],
            [
                'name' => 'Nigerian Embassy',
                'code' => 'NEM-USA',
                'description' => 'Nigerian diplomatic mission in Washington D.C., United States',
                'city' => 'Washington D.C.',
                'country' => 'United States',
                'region' => 'North America',
                'address' => '3519 International Court NW',
                'contact_email' => 'info@nigeriaembassyusa.org',
                'contact_phone' => '+1 202 986 8400',
                'status' => 'active',
                'staff_count' => 42,
            ],
            [
                'name' => 'Nigerian Consulate General',
                'code' => 'NCG-USA',
                'description' => 'Nigerian diplomatic mission in New York, United States',
                'city' => 'New York',
                'country' => 'United States',
                'region' => 'North America',
                'address' => '828 Second Avenue',
                'contact_email' => 'info@nigeriacgny.org',
                'contact_phone' => '+1 212 808 0301',
                'status' => 'active',
                'staff_count' => 25,
            ],
            [
                'name' => 'Nigerian Embassy',
                'code' => 'NEM-CHN',
                'description' => 'Nigerian diplomatic mission in Beijing, China',
                'city' => 'Beijing',
                'country' => 'China',
                'region' => 'Asia',
                'address' => '2 Dong Wu Jie, San Li Tun',
                'contact_email' => 'info@nigeriaembassychina.org',
                'contact_phone' => '+86 10 6532 3631',
                'status' => 'active',
                'staff_count' => 28,
            ],
            [
                'name' => 'Nigerian Embassy',
                'code' => 'NEM-SAU',
                'description' => 'Nigerian diplomatic mission in Riyadh, Saudi Arabia',
                'city' => 'Riyadh',
                'country' => 'Saudi Arabia',
                'region' => 'Middle East',
                'address' => 'Diplomatic Quarter',
                'contact_email' => 'info@nigeriaembassyriyadh.org',
                'contact_phone' => '+966 11 488 0361',
                'status' => 'active',
                'staff_count' => 22,
            ],
        ];

        foreach ($sampleMissions as $missionData) {
            Mission::create(array_merge($missionData, [
                'created_by' => $creator->id,
            ]));
        }

        $this->command->info('Successfully seeded ' . count($sampleMissions) . ' sample missions!');
    }
}
