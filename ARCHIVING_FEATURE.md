# Document Archiving Feature

## Overview

The Document Archiving feature allows users to upload, manage, and archive passport and visa-related documents. Administrators can review, approve, or reject submitted documents.

## Features

### For Users (role: "user")
- ✅ Upload PDF documents (max 5MB)
- ✅ Categorize documents (Passport, Visa, Other)
- ✅ Add title and description to documents
- ✅ View all uploaded documents with status
- ✅ Filter and search documents
- ✅ Download approved documents
- ✅ Delete pending documents
- ✅ View approval/rejection comments from admins

### For Admins (role: "admin" or "super_admin")
- ✅ View all user-submitted documents
- ✅ Review pending documents
- ✅ Approve or reject documents with comments
- ✅ View document statistics dashboard
- ✅ Filter and search all documents
- ✅ Download any document

## Installation & Setup

### 1. Run Database Migration

Navigate to the backend directory and run the migration:

```bash
cd backend
php artisan migrate
```

This will create the `documents` table with the following structure:
- Document metadata (title, description, type)
- File information (path, name, size, mime type)
- Status tracking (pending, approved, rejected)
- Review information (reviewer, comments, timestamp)

### 2. Create Storage Directory

Ensure the documents storage directory exists and has proper permissions:

```bash
cd backend
mkdir -p storage/app/documents
chmod -R 775 storage/app/documents
```

### 3. Configure Environment

Make sure your `.env` file has the correct `APP_URL` set:

```env
APP_URL=http://localhost:8000
```

For the frontend, ensure `NEXT_PUBLIC_API_URL` is set in your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

All endpoints require authentication via Sanctum token.

### Document Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/documents` | List documents | All authenticated users |
| GET | `/api/documents/statistics` | Get document statistics | Admin only |
| GET | `/api/documents/{id}` | View single document | Owner or Admin |
| POST | `/api/documents` | Upload new document | User role only |
| GET | `/api/documents/{id}/download` | Download document | Owner or Admin |
| POST | `/api/documents/{id}/approve` | Approve document | Admin only |
| POST | `/api/documents/{id}/reject` | Reject document | Admin only |
| DELETE | `/api/documents/{id}` | Delete document | Owner (pending only) or Admin |

### Upload Document Request

```json
POST /api/documents
Content-Type: multipart/form-data

{
  "title": "Nigerian Passport - John Doe",
  "description": "Valid until 2030",
  "document_type": "passport",
  "file": [PDF file, max 5MB]
}
```

### Approve/Reject Document Request

```json
POST /api/documents/{id}/approve
Content-Type: application/json

{
  "comments": "Document verified and approved"
}
```

```json
POST /api/documents/{id}/reject
Content-Type: application/json

{
  "comments": "Document is unclear, please resubmit with better quality"
}
```

## Frontend Routes

### User Routes
- `/archiving` - Document upload and management page (User role only)

### Admin Routes
- `/documents-review` - Document review and approval page (Admin/Super Admin only)

## File Validation

### Allowed File Types
- PDF only (`.pdf`)

### File Size Limit
- Maximum: 5MB (5,120 KB)

### Validation Messages
- "Only PDF files are allowed"
- "File size must be less than 5MB"

## Document Status Workflow

```
┌─────────┐
│ Upload  │
└────┬────┘
     │
     ▼
┌─────────┐     Admin Review      ┌──────────┐
│ Pending ├────────────────────────▶ Approved │
└────┬────┘                        └──────────┘
     │
     │ Admin Review
     ▼
┌──────────┐
│ Rejected │
└──────────┘
```

## User Interface

### Archiving Page (Users)
- **Upload Form**: Drag-and-drop or click to upload
- **Document List**: Grid view with status badges
- **Filters**: Search, status filter, document type filter
- **Actions**: Download, Delete (pending only)
- **Status Indicators**:
  - 🟡 Pending Review
  - 🟢 Approved
  - 🔴 Rejected

### Documents Review Page (Admins)
- **Statistics Dashboard**: Total, Pending, Approved, Rejected counts
- **Document List**: All user documents with user information
- **Filters**: Search, status filter, document type filter
- **Actions**: Download, Approve, Reject
- **Review Modal**: Add comments when approving/rejecting

## Security & Permissions

### Authorization Rules

1. **Upload Documents**: Only users with "user" role
2. **View Documents**: 
   - Users can only view their own documents
   - Admins can view all documents
3. **Download Documents**:
   - Users can download their own documents
   - Admins can download any document
4. **Delete Documents**:
   - Users can only delete their own pending documents
   - Admins can delete any document
5. **Approve/Reject**: Only admins and super admins

### File Storage

- Documents are stored in `storage/app/documents/` (private)
- Files are not publicly accessible
- Downloads are authenticated and authorized
- File paths are hashed to prevent direct access

## Testing Checklist

- [ ] User can upload PDF document (max 5MB)
- [ ] File type validation works (PDF only)
- [ ] File size validation works (5MB limit)
- [ ] User can only see their own documents
- [ ] Admin can see all documents
- [ ] Admin can approve documents
- [ ] Admin can reject documents with comments
- [ ] User receives approval/rejection notifications
- [ ] User can download approved documents
- [ ] User can delete pending documents
- [ ] Search and filter functionality works
- [ ] Statistics dashboard shows correct counts
- [ ] Navigation links appear for correct roles

## Troubleshooting

### Upload Fails
- Check file size (must be < 5MB)
- Verify file type is PDF
- Ensure storage directory has write permissions
- Check Laravel logs: `backend/storage/logs/laravel.log`

### Download Fails
- Verify file exists in storage
- Check user permissions
- Ensure document status allows download

### Permission Denied
- Verify user role is correct
- Check authentication token is valid
- Review DocumentPolicy rules

## Future Enhancements

Potential improvements for future versions:

1. **Email Notifications**: Notify users when documents are approved/rejected
2. **Bulk Operations**: Approve/reject multiple documents at once
3. **Document Expiry**: Track document expiration dates
4. **Version Control**: Allow document updates with version history
5. **Advanced Search**: Search by date range, user, etc.
6. **Export Reports**: Generate PDF/Excel reports of documents
7. **Document Categories**: More granular categorization
8. **File Preview**: In-browser PDF preview
9. **Audit Trail**: Detailed logging of all document actions
10. **Cloud Storage**: Integration with AWS S3 or similar

## Support

For issues or questions about the archiving feature, please contact the development team or create an issue in the project repository.
