# Testing Guide - Immigration Service Application

## 🧪 Comprehensive Testing Checklist

This guide covers testing for all newly implemented features across different user roles.

---

## Prerequisites

### Backend Setup
```bash
cd backend
php artisan migrate:fresh --seed  # Fresh database with test data
php artisan serve                  # Start Laravel server on port 8000
```

### Frontend Setup
```bash
pnpm install                       # Install dependencies
pnpm dev                          # Start Next.js on port 3000
```

### Test Users
Based on `backend/MOCK_USERS_CREDENTIALS.md`:
- **Super Admin**: superadmin@nis.gov / password123
- **Admin**: admin@nis.gov / password123
- **Supervisor**: supervisor@nis.gov / password123
- **User**: user@nis.gov / password123

---

## Phase 1: Admin Metric Dashboard

### Test Cases

#### TC1.1: Dashboard Access
- [ ] Login as admin@nis.gov
- [ ] Navigate to Dashboard
- [ ] Verify dashboard loads without errors
- [ ] Check all KPI cards display data

#### TC1.2: Charts Rendering
- [ ] Verify Line Chart (Reports Trend) displays
- [ ] Verify Bar Chart (Reports by Status) displays
- [ ] Verify Pie Chart (Users by Role) displays
- [ ] Check chart interactions (hover, tooltips)

#### TC1.3: Data Tables
- [ ] Verify "All Reports" table displays
- [ ] Test search functionality in reports table
- [ ] Test filter by status dropdown
- [ ] Verify pagination works
- [ ] Check "Active Users" table displays
- [ ] Verify user data is accurate

#### TC1.4: Real-time Updates
- [ ] Open dashboard in two browser windows
- [ ] Create a new report in one window
- [ ] Refresh dashboard in other window
- [ ] Verify new data appears

#### TC1.5: Responsive Design
- [ ] Test on desktop (1920px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Verify charts adapt to screen size

---

## Phase 2: User Management

### Test Cases

#### TC2.1: Access Control
- [ ] Login as regular user
- [ ] Verify "User Management" link NOT visible in sidebar
- [ ] Try accessing /user-management directly
- [ ] Verify redirect or access denied
- [ ] Login as admin
- [ ] Verify "User Management" link IS visible

#### TC2.2: User List
- [ ] Navigate to User Management
- [ ] Verify user list table displays
- [ ] Check all columns: Name, Email, Role, Status, Actions
- [ ] Verify pagination controls

#### TC2.3: Search Functionality
- [ ] Enter user name in search box
- [ ] Verify filtered results
- [ ] Enter email in search box
- [ ] Verify filtered results
- [ ] Clear search
- [ ] Verify all users return

#### TC2.4: Filter by Role
- [ ] Select "Admin" from role filter
- [ ] Verify only admins shown
- [ ] Select "User" from role filter
- [ ] Verify only users shown
- [ ] Select "All Roles"
- [ ] Verify all users shown

#### TC2.5: Create User
- [ ] Click "Add User" button
- [ ] Fill in all required fields:
  - First Name: Test
  - Last Name: User
  - Email: testuser@test.com
  - Password: password123
  - Role: User
- [ ] Click "Create User"
- [ ] Verify success message
- [ ] Verify new user appears in list

#### TC2.6: Edit User
- [ ] Click edit icon on a user
- [ ] Modify first name
- [ ] Change role
- [ ] Click "Update User"
- [ ] Verify success message
- [ ] Verify changes reflected in list

#### TC2.7: Delete User
- [ ] Click delete icon on test user
- [ ] Verify confirmation dialog
- [ ] Click "Delete"
- [ ] Verify success message
- [ ] Verify user removed from list

#### TC2.8: Role Management
- [ ] Edit a user
- [ ] Change role from "user" to "supervisor"
- [ ] Save changes
- [ ] Login as that user
- [ ] Verify new role permissions apply

---

## Phase 3: Collapsible Sidebar Navigation

### Test Cases

#### TC3.1: Sidebar Display
- [ ] Login as any user
- [ ] Verify sidebar appears on left
- [ ] Check logo and app name display
- [ ] Verify user avatar at bottom

#### TC3.2: Collapse/Expand
- [ ] Click collapse button (or use keyboard shortcut)
- [ ] Verify sidebar collapses to icon-only mode
- [ ] Verify tooltips appear on hover
- [ ] Click expand button
- [ ] Verify sidebar expands with labels

#### TC3.3: Role-Based Menu Items
- [ ] Login as regular user
- [ ] Verify menu shows: Home, Dashboard, Reporting, Archiving, Messages, Calendar
- [ ] Verify NO: Missions, Documents Review, User Management
- [ ] Logout and login as admin
- [ ] Verify menu shows: Home, Dashboard, Reporting, Missions, Documents Review, User Management, Messages, Calendar
- [ ] Verify NO: Archiving

#### TC3.4: Active State
- [ ] Navigate to Dashboard
- [ ] Verify Dashboard menu item highlighted
- [ ] Navigate to Messages
- [ ] Verify Messages menu item highlighted
- [ ] Verify previous item no longer highlighted

#### TC3.5: Mobile Responsive
- [ ] Resize browser to mobile width (< 768px)
- [ ] Verify sidebar becomes drawer
- [ ] Click menu icon to open
- [ ] Verify drawer slides in
- [ ] Click outside or close button
- [ ] Verify drawer closes

#### TC3.6: User Profile Dropdown
- [ ] Click on user avatar at bottom
- [ ] Verify dropdown opens
- [ ] Check displays: Name, Email, Role
- [ ] Click "Profile Settings"
- [ ] Verify navigates to profile
- [ ] Open dropdown again
- [ ] Click "Dashboard"
- [ ] Verify navigates to appropriate dashboard
- [ ] Open dropdown again
- [ ] Click "Log out"
- [ ] Verify logged out and redirected

#### TC3.7: Persistent State
- [ ] Collapse sidebar
- [ ] Refresh page
- [ ] Verify sidebar remains collapsed
- [ ] Expand sidebar
- [ ] Refresh page
- [ ] Verify sidebar remains expanded

---

## Phase 4: Notification System

### Test Cases

#### TC4.1: Notification Bell
- [ ] Login as any user
- [ ] Locate notification bell in sidebar
- [ ] Verify bell icon displays
- [ ] Check for unread count badge (if any notifications exist)

#### TC4.2: View Notifications
- [ ] Click notification bell
- [ ] Verify dropdown opens
- [ ] Check notifications display with:
  - Icon based on type
  - Title
  - Message
  - Timestamp (relative)
  - Read/unread indicator

#### TC4.3: Mark as Read
- [ ] Click on an unread notification
- [ ] Verify it navigates to action URL
- [ ] Return to notifications
- [ ] Verify notification marked as read
- [ ] Verify unread count decreased

#### TC4.4: Mark All as Read
- [ ] Have multiple unread notifications
- [ ] Click "Mark all as read" button
- [ ] Verify all notifications marked as read
- [ ] Verify unread count becomes 0

#### TC4.5: Delete Notification
- [ ] Hover over a notification
- [ ] Click delete icon
- [ ] Verify notification removed
- [ ] Verify list updates

#### TC4.6: Real-time Updates
- [ ] Open app in two browser windows (different users)
- [ ] In window 1, create an event and invite user from window 2
- [ ] Wait up to 30 seconds
- [ ] Verify notification appears in window 2
- [ ] Verify unread count updates

#### TC4.7: Notification Types
- [ ] Create different notification types:
  - System: Broadcast message (as admin)
  - Message: Send a message to another user
  - Event: Create event with attendees
  - Report: Submit a report
- [ ] Verify each type displays correct icon and color

#### TC4.8: Empty State
- [ ] Delete all notifications
- [ ] Click notification bell
- [ ] Verify "No notifications" message displays

---

## Phase 5: Direct Messaging

### Test Cases

#### TC5.1: Access Messages
- [ ] Login as any user
- [ ] Click "Messages" in sidebar
- [ ] Verify messaging page loads
- [ ] Check split-view layout (conversations | messages)

#### TC5.2: Conversation List
- [ ] Verify existing conversations display
- [ ] Check each shows:
  - User avatar with initials
  - User name
  - Latest message preview
  - Timestamp
  - Unread badge (if unread)

#### TC5.3: Start New Conversation
- [ ] Click "New Message" button
- [ ] Verify user search modal opens
- [ ] Type user name in search
- [ ] Verify filtered results
- [ ] Click on a user
- [ ] Verify conversation starts
- [ ] Verify message input focused

#### TC5.4: Send Message
- [ ] Select a conversation
- [ ] Type message in input field
- [ ] Click Send (or press Enter)
- [ ] Verify message appears in thread
- [ ] Verify message shows on right side (own message)
- [ ] Verify timestamp displays

#### TC5.5: Receive Message
- [ ] Open app in two browser windows (different users)
- [ ] In window 1, send message to user in window 2
- [ ] Wait up to 10 seconds
- [ ] Verify message appears in window 2
- [ ] Verify unread badge appears on conversation
- [ ] Verify notification sent

#### TC5.6: Edit Message
- [ ] Send a message
- [ ] Click edit icon on your message
- [ ] Modify text
- [ ] Click save
- [ ] Verify message updated
- [ ] Verify "edited" indicator appears

#### TC5.7: Delete Message
- [ ] Send a message
- [ ] Click delete icon on your message
- [ ] Verify confirmation dialog
- [ ] Click confirm
- [ ] Verify message removed from thread

#### TC5.8: Mark as Read
- [ ] Have unread messages in a conversation
- [ ] Click on that conversation
- [ ] Verify messages load
- [ ] Wait a moment
- [ ] Verify unread badge disappears
- [ ] Check unread count in sidebar decreases

#### TC5.9: Search Conversations
- [ ] Have multiple conversations
- [ ] Type user name in search box
- [ ] Verify filtered conversations
- [ ] Clear search
- [ ] Verify all conversations return

#### TC5.10: Real-time Updates
- [ ] Open conversation in two windows (same user)
- [ ] Send message in window 1
- [ ] Wait up to 10 seconds
- [ ] Verify message appears in window 2
- [ ] Edit message in window 1
- [ ] Verify edit appears in window 2

#### TC5.11: Empty States
- [ ] New user with no conversations
- [ ] Verify "No conversations" message
- [ ] Start a conversation
- [ ] Verify "No messages yet" in thread
- [ ] Send first message
- [ ] Verify message appears

---

## Phase 6: Calendar Feature

### Test Cases

#### TC6.1: Access Calendar
- [ ] Login as any user
- [ ] Click "Calendar" in sidebar
- [ ] Verify calendar page loads
- [ ] Check month view displays by default

#### TC6.2: Month View
- [ ] Verify current month displays
- [ ] Check all days of month shown
- [ ] Verify today is highlighted
- [ ] Check events appear on correct dates
- [ ] Verify events show title and color

#### TC6.3: Week View
- [ ] Click "Week" button
- [ ] Verify 7-day week view displays
- [ ] Check current week shown
- [ ] Verify events display with times
- [ ] Check today is highlighted

#### TC6.4: Day View
- [ ] Click "Day" button
- [ ] Verify single day view displays
- [ ] Check all events for day listed
- [ ] Verify full event details shown
- [ ] Check time-based sorting

#### TC6.5: Navigation
- [ ] Click "Previous" button
- [ ] Verify previous month/week/day displays
- [ ] Click "Next" button
- [ ] Verify next month/week/day displays
- [ ] Click "Today" button
- [ ] Verify returns to current date

#### TC6.6: Create Event
- [ ] Click "New Event" button
- [ ] Fill in event details:
  - Title: Team Meeting
  - Description: Weekly sync
  - Start: Tomorrow 10:00 AM
  - End: Tomorrow 11:00 AM
  - Category: Meeting
  - Location: Conference Room A
- [ ] Click "Create Event"
- [ ] Verify success message
- [ ] Verify event appears on calendar

#### TC6.7: Quick Create from Date
- [ ] In month view, click on a date
- [ ] Verify event modal opens
- [ ] Check date pre-filled
- [ ] Fill in title and other details
- [ ] Save event
- [ ] Verify event appears on that date

#### TC6.8: Edit Event
- [ ] Click on an existing event
- [ ] Verify event modal opens in edit mode
- [ ] Modify title and time
- [ ] Click "Update Event"
- [ ] Verify success message
- [ ] Verify changes reflected on calendar

#### TC6.9: Delete Event
- [ ] Click on an event
- [ ] Click delete button
- [ ] Verify confirmation dialog
- [ ] Click confirm
- [ ] Verify success message
- [ ] Verify event removed from calendar

#### TC6.10: Event Categories
- [ ] Create events with different categories:
  - Meeting (blue)
  - Deadline (red)
  - Mission (green)
  - Personal (purple)
  - Other (gray)
- [ ] Verify each displays with correct color
- [ ] Verify category badge shows in day view

#### TC6.11: All-Day Events
- [ ] Create new event
- [ ] Toggle "All day event" switch
- [ ] Verify time fields disabled
- [ ] Save event
- [ ] Verify event shows as all-day on calendar

#### TC6.12: Event Reminders
- [ ] Create new event
- [ ] Enable reminder toggle
- [ ] Set reminder to 15 minutes before
- [ ] Save event
- [ ] Verify reminder settings saved

#### TC6.13: Event with Attendees
- [ ] Create new event
- [ ] Add attendees (user IDs)
- [ ] Save event
- [ ] Login as attendee user
- [ ] Verify notification received
- [ ] Check notification links to calendar

#### TC6.14: Custom Colors
- [ ] Create new event
- [ ] Click color picker
- [ ] Select custom color
- [ ] Save event
- [ ] Verify event displays with custom color

#### TC6.15: Event Details in Day View
- [ ] Switch to day view
- [ ] Verify events show:
  - Title
  - Description
  - Time range
  - Location (if set)
  - Category badge
- [ ] Click event
- [ ] Verify can edit from day view

#### TC6.16: Multiple Events Same Day
- [ ] Create 5+ events on same day
- [ ] In month view, verify shows first 3
- [ ] Verify "+X more" indicator
- [ ] Click on date
- [ ] Verify all events accessible

---

## Cross-Feature Integration Tests

### INT1: Notification → Calendar
- [ ] Create event with attendees
- [ ] Login as attendee
- [ ] Click notification
- [ ] Verify navigates to calendar
- [ ] Verify event highlighted

### INT2: Notification → Messages
- [ ] Send message to user
- [ ] Login as recipient
- [ ] Click message notification
- [ ] Verify navigates to messages
- [ ] Verify conversation opened

### INT3: User Management → Messages
- [ ] Create new user
- [ ] Login as different user
- [ ] Start conversation with new user
- [ ] Verify can message new user

### INT4: Sidebar → All Features
- [ ] Test navigation from sidebar to:
  - Dashboard
  - User Management
  - Messages
  - Calendar
  - Reporting
- [ ] Verify active state updates
- [ ] Verify all pages load correctly

### INT5: Role Changes
- [ ] Change user role from user to admin
- [ ] Logout and login as that user
- [ ] Verify sidebar menu updates
- [ ] Verify can access admin features
- [ ] Verify cannot access user-only features

---

## Performance Tests

### PERF1: Dashboard Load Time
- [ ] Clear cache
- [ ] Navigate to dashboard
- [ ] Measure load time (should be < 2s)
- [ ] Check for console errors

### PERF2: Large Dataset Handling
- [ ] Create 100+ events
- [ ] Load calendar
- [ ] Verify smooth rendering
- [ ] Test navigation between months

### PERF3: Real-time Polling
- [ ] Monitor network tab
- [ ] Verify notification polling every 30s
- [ ] Verify message polling every 10s
- [ ] Check no memory leaks over 5 minutes

### PERF4: Search Performance
- [ ] User management with 50+ users
- [ ] Type in search box
- [ ] Verify instant filtering
- [ ] Check no lag or freezing

---

## Security Tests

### SEC1: Authentication
- [ ] Try accessing protected routes without login
- [ ] Verify redirect to login
- [ ] Login with invalid credentials
- [ ] Verify error message

### SEC2: Authorization
- [ ] Login as regular user
- [ ] Try accessing /user-management
- [ ] Verify access denied
- [ ] Try API call to admin endpoint
- [ ] Verify 403 response

### SEC3: Data Ownership
- [ ] Login as User A
- [ ] Create event
- [ ] Note event ID
- [ ] Login as User B
- [ ] Try to edit User A's event via API
- [ ] Verify 403 response

### SEC4: XSS Prevention
- [ ] Create event with title: `<script>alert('XSS')</script>`
- [ ] View event on calendar
- [ ] Verify script not executed
- [ ] Verify displays as text

---

## Browser Compatibility

Test all features in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Accessibility Tests

### A11Y1: Keyboard Navigation
- [ ] Navigate entire app using only keyboard
- [ ] Verify all interactive elements focusable
- [ ] Check focus indicators visible
- [ ] Test Tab, Shift+Tab, Enter, Escape

### A11Y2: Screen Reader
- [ ] Use screen reader (NVDA/JAWS)
- [ ] Verify all content readable
- [ ] Check form labels announced
- [ ] Verify button purposes clear

### A11Y3: Color Contrast
- [ ] Check all text meets WCAG AA standards
- [ ] Verify buttons have sufficient contrast
- [ ] Check disabled states distinguishable

---

## Bug Reporting Template

When you find a bug, report it with:

```
**Bug ID**: BUG-XXX
**Feature**: [Phase X - Feature Name]
**Severity**: Critical / High / Medium / Low
**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Result**:

**Actual Result**:

**Screenshots**: [if applicable]

**Browser/Device**: 

**User Role**: 

**Console Errors**: [if any]
```

---

## Testing Completion Checklist

- [ ] All Phase 1 tests passed
- [ ] All Phase 2 tests passed
- [ ] All Phase 3 tests passed
- [ ] All Phase 4 tests passed
- [ ] All Phase 5 tests passed
- [ ] All Phase 6 tests passed
- [ ] All integration tests passed
- [ ] All performance tests passed
- [ ] All security tests passed
- [ ] All browser compatibility tests passed
- [ ] All accessibility tests passed
- [ ] All bugs documented
- [ ] Critical bugs fixed
- [ ] Regression testing completed

---

## Next Steps After Testing

1. Document all findings
2. Create bug tickets for issues
3. Prioritize fixes
4. Implement fixes
5. Re-test affected areas
6. Update documentation
7. Prepare for deployment

---

**Happy Testing! 🧪**
