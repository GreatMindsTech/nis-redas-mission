# NIS REDAS - Reporting Dashboard And Archiving System For Immigration Missions

![NIS REDAS](public/nis.svg)

A comprehensive full-stack application for managing reports on passports and visa applications in all Immigration desks at Diplomatic abroad.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [User Roles & Test Credentials](#user-roles--test-credentials)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

NIS REDAS is a modern web application designed to streamline reporting and archiving of visa and passport applications and provide efficient support for Immigration Attaches globally.

The system provides:
- **Application Management**: Easy submission and tracking of visa applications
- **Mission Tracking**: Monitor diplomatic missions and support services globally
- **Role-Based Access Control**: Different views and permissions for various user levels
- **Audit Logging**: Complete tracking of all system activities
- **Real-time Updates**: Live status updates for applications and missions

## ✨ Features

### For Users
- Submit and track visa applications
- View application status and history
- Update profile information
- Access mission information

### For Supervisors
- Review and process applications
- Manage assigned missions
- Monitor team activities
- Generate reports

### For Admins
- Full application management
- User management and role assignment
- Mission creation and assignment
- System configuration

### For Super Admins
- Complete system access
- User role management
- System-wide settings
- Audit log access

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

### Backend
- **Framework**: [Laravel 12](https://laravel.com/)
- **Language**: PHP 8.2+
- **Authentication**: Laravel Sanctum
- **Database**: MySQL/PostgreSQL
- **ORM**: Eloquent
- **API**: RESTful API

### Development Tools
- **Package Manager**: pnpm (frontend), Composer (backend)
- **Code Quality**: ESLint, Laravel Pint
- **Version Control**: Git

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Frontend Requirements
- Node.js 18.x or higher
- pnpm 8.x or higher (or npm/yarn)

### Backend Requirements
- PHP 8.2 or higher
- Composer 2.x
- MySQL 8.0+ or PostgreSQL 13+
- PHP Extensions:
  - OpenSSL
  - PDO
  - Mbstring
  - Tokenizer
  - XML
  - Ctype
  - JSON
  - BCMath

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd immigration-service-app
```

### 2. Frontend Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables (create .env.local if needed)
# Configure your API endpoint
```

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=immigration_service
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations and seed database
php artisan migrate:fresh --seed
```

For detailed backend setup instructions, see [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md)

## 🏃 Running the Application

### Development Mode

#### Start Frontend (from root directory)
```bash
pnpm dev
```
The frontend will be available at `http://localhost:3000`

#### Start Backend (from backend directory)
```bash
cd backend
php artisan serve
```
The backend API will be available at `http://localhost:8000`

### Production Build

#### Frontend
```bash
pnpm build
pnpm start
```

#### Backend
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 👥 User Roles & Test Credentials

The system includes pre-seeded test users for development:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | super_admin@example.com | password | Full system access |
| Admin | admin@example.com | password | Administrative access |
| Supervisor | supervisor@example.com | password | Supervisory access |
| User | user@example.com | password | Basic user access |

⚠️ **Security Note**: These credentials are for development only. Change all passwords before deploying to production.

### Role Hierarchy

```
Super Admin (Highest)
    ↓
  Admin
    ↓
Supervisor
    ↓
  User (Lowest)
```

## 📁 Project Structure

```
immigration-service-app/
├── app/                          # Next.js app directory (routes)
│   ├── about/                    # About page
│   ├── dashboard/                # Dashboard routes
│   │   ├── admin/               # Admin dashboard
│   │   ├── super-admin/         # Super admin dashboard
│   │   ├── supervisor/          # Supervisor dashboard
│   │   └── user/                # User dashboard
│   ├── login/                    # Login page
│   ├── missions/                 # Missions page
│   ├── profile/                  # Profile page
│   ├── register/                 # Registration page
│   ├── services/                 # Services page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── backend/                      # Laravel backend
│   ├── app/                     # Application code
│   │   ├── Http/Controllers/   # API controllers
│   │   ├── Models/             # Eloquent models
│   │   └── Policies/           # Authorization policies
│   ├── config/                  # Configuration files
│   ├── database/                # Migrations and seeders
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/            # Database seeders
│   ├── routes/                  # API routes
│   └── tests/                   # Backend tests
├── components/                   # React components
│   ├── contexts/                # React contexts
│   ├── pages/                   # Page components
│   ├── ui/                      # shadcn/ui components
│   ├── Footer.tsx              # Footer component
│   ├── Header.tsx              # Header component
│   └── ProtectedRoute.tsx      # Route protection
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── public/                       # Static assets
├── styles/                       # Additional styles
├── .gitignore                   # Git ignore rules
├── components.json              # shadcn/ui config
├── next.config.mjs              # Next.js configuration
├── package.json                 # Frontend dependencies
├── pnpm-lock.yaml              # pnpm lock file
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                    # This file
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/register          # Register new user
POST   /api/login             # User login
POST   /api/logout            # User logout
GET    /api/user              # Get authenticated user
```

### Application Endpoints

```
GET    /api/applications      # List applications
POST   /api/applications      # Create application
GET    /api/applications/{id} # Get application details
PUT    /api/applications/{id} # Update application
DELETE /api/applications/{id} # Delete application
```

### Mission Endpoints

```
GET    /api/missions          # List missions
POST   /api/missions          # Create mission
GET    /api/missions/{id}     # Get mission details
PUT    /api/missions/{id}     # Update mission
DELETE /api/missions/{id}     # Delete mission
```

### User Management (Admin/Super Admin only)

```
GET    /api/users             # List users
POST   /api/users             # Create user
GET    /api/users/{id}        # Get user details
PUT    /api/users/{id}        # Update user
DELETE /api/users/{id}        # Delete user
```

For detailed API documentation, see the backend routes in `backend/routes/api.php`

## 🧪 Testing

### Frontend Tests
```bash
# Run tests (when configured)
pnpm test
```

### Backend Tests
```bash
cd backend
php artisan test
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=NIS REDAS
```

#### Backend (.env)
```env
APP_NAME="NIS REDAS"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=immigration_service
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- **Frontend**: Follow TypeScript and React best practices
- **Backend**: Follow PSR-12 coding standards
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 Additional Documentation

- [Backend Setup Guide](backend/DATABASE_SETUP.md)
- [Quick Start Guide](backend/QUICK_START.md)
- [Mock Users Credentials](backend/MOCK_USERS_CREDENTIALS.md)
- [Test Results](backend/TEST_RESULTS.md)
- [Changes Summary](backend/CHANGES_SUMMARY.md)

## 🐛 Troubleshooting

### Common Issues

**Frontend won't start**
- Ensure Node.js 18+ is installed
- Delete `node_modules` and `.next` folders, then run `pnpm install`
- Check if port 3000 is available

**Backend won't start**
- Verify PHP 8.2+ is installed
- Check database connection in `.env`
- Run `composer install` again
- Clear cache: `php artisan cache:clear`

**Database connection errors**
- Verify database credentials in `.env`
- Ensure database server is running
- Check if database exists: `CREATE DATABASE immigration_service;`

**Authentication issues**
- Clear browser cookies and local storage
- Verify SANCTUM_STATEFUL_DOMAINS in backend `.env`
- Check CORS configuration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Development Team

Developed for the Nigeria Immigration Service (NIS)

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `backend/` directory

---

**Version**: 0.1.0  
**Last Updated**: 2024

Made with ❤️ for Nigeria Immigration Service
