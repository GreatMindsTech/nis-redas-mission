# Archiving Feature Implementation TODO

## Backend Tasks

### Database
- [x] Create documents migration with fields:
  - id, user_id, mission_id (nullable), document_type, title, description
  - file_path, file_name, file_size, mime_type
  - status (pending/approved/rejected), reviewed_by, reviewed_at, review_comments
  - timestamps, soft_deletes

### Models & Policies
- [x] Create Document model with relationships and accessors
- [x] Create DocumentPolicy for authorization
- [x] Update User model with documents relationships

### Controllers
- [x] Create DocumentController with methods:
  - index() - List documents (filtered by role)
  - store() - Upload document (user role only, PDF, 5MB max)
  - show() - View single document
  - download() - Download document file
  - approve() - Approve document (admin only)
  - reject() - Reject document (admin only)
  - destroy() - Delete document
  - statistics() - Get document stats (admin only)

### Routes & Config
- [x] Add document routes to api.php
- [x] Update filesystems.php to add documents disk

## Frontend Tasks

### Pages & Components
- [x] Create app/archiving/page.tsx (protected route)
- [x] Create components/pages/ArchivingPage.tsx (user upload & view)
- [x] Create app/documents-review/page.tsx (admin only)
- [x] Create components/pages/DocumentsReviewPage.tsx (admin review interface)

### Navigation
- [x] Update Header.tsx to add "Archiving" link (user role only)
- [x] Update Header.tsx to add "Documents Review" link (admin roles only)

## Testing & Verification
- [ ] Run migration
- [ ] Create storage link
- [ ] Test file upload (user role)
- [ ] Test file size validation (5MB limit)
- [ ] Test file type validation (PDF only)
- [ ] Test user can only see their documents
- [ ] Test admin can see all documents
- [ ] Test admin approval/rejection workflow
- [ ] Test file download functionality

## Current Status: Implementation Complete ✓
## Next Step: Run migrations and test the feature
