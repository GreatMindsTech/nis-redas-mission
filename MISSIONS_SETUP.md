# Missions Setup Guide

This guide explains how to populate the missions database with data from Nigerian Foreign Missions.

## Overview

The missions feature includes:
- Web scraper to collect mission data
- Database seeder to populate the missions table
- Updated frontend component with pagination and API integration

## Setup Steps

### 1. Run the Web Scraper (Optional)

The scraper attempts to fetch data from the Nigerian UN Mission website. If it fails, it generates comprehensive sample data based on known Nigerian diplomatic missions worldwide.

```bash
# Run the scraper
node scripts/scrape-missions.js
```

This will create a `backend/database/data/missions.json` file with mission data.

**Note:** The scraper includes fallback data for 30 Nigerian missions across all continents, so you don't need to worry if the website scraping fails.

### 2. Seed the Database

Navigate to the backend directory and run the seeder:

```bash
cd backend

# Run all seeders (includes users and missions)
php artisan db:seed

# Or run only the mission seeder
php artisan db:seed --class=MissionSeeder
```

The seeder will:
- Look for `backend/database/data/missions.json` first
- If not found, use built-in sample data (12 major missions)
- Create missions with proper relationships to admin users

### 3. Verify the Data

Check that missions were created successfully:

```bash
cd backend
php artisan tinker
```

Then in the tinker console:
```php
\App\Models\Mission::count();  // Should show number of missions
\App\Models\Mission::first();  // Show first mission details
```

## Frontend Usage

The updated `MissionsPage.tsx` component now:

✅ Fetches missions from the API endpoint `/api/missions`
✅ **Color-coded by continent** with distinct visual themes:
   - **Africa**: Green theme
   - **Europe**: Blue theme
   - **Asia**: Orange theme
   - **North America**: Brown/Amber theme
   - **South America**: Orange theme
   - **Oceania**: Red theme
   - **Middle East**: Purple theme
✅ **Search functionality** - Search by name, city, country, region, or code
✅ **Continent filtering** - Quick filter buttons to view missions by continent
✅ **Grouped display** - Missions organized by continent with section headers
✅ Displays missions in a responsive grid layout
✅ Includes loading states and error handling
✅ Displays mission details: name, location, contact info, staff count
✅ Shows mission status badges (active/inactive/pending)
✅ Shows mission count per continent and total count

## Mission Data Structure

Each mission includes:

- **name**: Mission name (e.g., "Nigerian High Commission")
- **code**: Unique mission code (e.g., "NHC-GHA")
- **description**: Brief description
- **city**: City location
- **country**: Country location
- **region**: Geographic region (West Africa, Europe, etc.)
- **address**: Physical address (optional)
- **contact_email**: Email address (optional)
- **contact_phone**: Phone number (optional)
- **status**: Mission status (active/inactive/pending)
- **staff_count**: Number of staff members

## Sample Missions Included

The system includes data for 30+ Nigerian diplomatic missions including:

### Africa
- Ghana (Accra)
- South Africa (Pretoria)
- Kenya (Nairobi)
- Ethiopia (Addis Ababa)
- Egypt (Cairo)
- And more...

### Europe
- United Kingdom (London)
- France (Paris)
- Germany (Berlin)
- Italy (Rome)
- Spain (Madrid)
- Russia (Moscow)

### Americas
- United States (Washington D.C., New York)
- Canada (Ottawa)
- Brazil (Brasília)

### Asia & Middle East
- China (Beijing)
- Japan (Tokyo)
- India (New Delhi)
- Saudi Arabia (Riyadh)
- UAE (Abu Dhabi)

### Oceania
- Australia (Canberra)

## API Endpoints

The backend provides these mission endpoints:

```
GET    /api/missions              - List all missions (paginated)
GET    /api/missions/{id}         - Get single mission details
POST   /api/missions              - Create new mission (admin only)
PUT    /api/missions/{id}         - Update mission (admin only)
DELETE /api/missions/{id}         - Delete mission (admin only)
POST   /api/missions/{id}/staff   - Add staff to mission (admin only)
DELETE /api/missions/{id}/staff   - Remove staff from mission (admin only)
```

## Troubleshooting

### No missions showing on frontend

1. Check if backend is running: `cd backend && php artisan serve`
2. Verify missions exist: `php artisan tinker` then `\App\Models\Mission::count()`
3. Check browser console for API errors
4. Verify authentication token is valid

### Seeder fails

1. Ensure users exist first: `php artisan db:seed --class=DatabaseSeeder`
2. Check database connection in `backend/.env`
3. Run migrations: `php artisan migrate:fresh`

### Scraper fails

Don't worry! The scraper includes comprehensive fallback data. The seeder will work even without the JSON file.

## Customization

### Adding More Missions

You can add missions manually through:

1. **Database seeder**: Edit `backend/database/seeders/MissionSeeder.php`
2. **API**: Use POST `/api/missions` endpoint (requires admin authentication)
3. **JSON file**: Add to `backend/database/data/missions.json` and re-run seeder

### Changing Pagination

Edit the pagination settings in:
- **Backend**: `backend/app/Http/Controllers/MissionController.php` (line with `paginate(15)`)
- **Frontend**: `components/pages/MissionsPage.tsx` (per_page value)

## Next Steps

After setting up missions:

1. ✅ Test the missions page at `/missions`
2. ✅ Verify pagination works correctly
3. ✅ Check that all mission details display properly
4. ✅ Test on different screen sizes (responsive design)
5. Consider adding mission detail pages
6. Consider adding search/filter functionality
7. Consider adding mission management UI for admins

## Support

For issues or questions:
- Check the Laravel logs: `backend/storage/logs/laravel.log`
- Check browser console for frontend errors
- Verify API responses using tools like Postman or curl
