# CrewHub - Staff Scheduling & Job Assignment PWA

## Executive Summary
A Progressive Web Application (PWA) for managing distributed workforce scheduling and job assignments. The system enables managers to create jobs at various locations, assign staff members, and track attendance, while staff can view their schedules, job details, and navigate to work locations.

## Core Features

### Manager Portal
- Create and manage job listings with location, date/time, and requirements
- Assign staff to jobs based on availability and skills
- View real-time staff availability and scheduling conflicts
- Track attendance and job completion
- Bulk import/export schedules
- Generate reports on staff utilization and job history

### Staff Portal
- View personal schedule and upcoming assignments
- Access job details including location, time, and requirements
- Get directions to job sites
- Confirm availability and attendance
- Receive push notifications for new assignments or changes
- Download schedule to calendar apps

## Technical Implementation

### Architecture
- **Frontend**: SvelteKit with static adapter (fully compiled to static files)
- **Backend**: Firebase services only (no custom backend)
- **Deployment**: Firebase Hosting or any static file host

### Firebase Services
```
Firestore Collections:
├── users/
│   ├── {uid}
│   │   ├── role: 'manager' | 'staff'
│   │   ├── name, email, phone
│   │   ├── skills: []
│   │   └── availability: {}
├── jobs/
│   ├── {jobId}
│   │   ├── title, description
│   │   ├── location: { address, coordinates }
│   │   ├── dateTime: { start, end }
│   │   ├── requiredStaff: number
│   │   ├── assignedStaff: [uid]
│   │   └── status: 'draft' | 'published' | 'completed'
├── assignments/
│   ├── {assignmentId}
│   │   ├── jobId, userId
│   │   ├── status: 'pending' | 'confirmed' | 'completed'
│   │   └── timestamps
└── notifications/
    └── {notificationId}
```

### Tech Stack
```javascript
// Core Dependencies
- sveltekit: ^2.0 (with @sveltejs/adapter-static)
- firebase: ^10.0 (Firestore, Auth, Storage)
- typescript: ^5.0

// UI/UX
- tailwindcss: ^3.0
- @fullcalendar/core: ^6.0 (calendar views)
- mapbox-gl: ^3.0 (location mapping)
- lucide-svelte (icons)

// PWA
- workbox: ^7.0 (service workers)
- web-push (notifications)

// Utilities
- date-fns: ^3.0 (date manipulation)
- zod: ^3.0 (validation)
- papaparse: ^5.0 (CSV import/export)
```

### Key Implementation Requirements

1. **Authentication Flow**
   - Firebase Auth with email/password
   - Role-based access (manager vs staff)
   - Persistent sessions with refresh tokens

2. **Offline Capability**
   - Service worker for offline access
   - Cache critical data (upcoming jobs, staff lists)
   - Queue actions for sync when online

3. **Real-time Updates**
   - Firestore listeners for schedule changes
   - Push notifications for new assignments
   - Optimistic UI updates with rollback

4. **Responsive Design**
   - Mobile-first approach
   - Touch-optimized interfaces
   - Native app-like experience on mobile

5. **Performance Targets**
   - Initial load: <3 seconds on 3G
   - Time to Interactive: <5 seconds
   - Lighthouse PWA score: >90

### Development Phases

**Phase 1 - Core (2-3 weeks)**
- Firebase setup and authentication
- Basic CRUD for jobs and users
- Staff assignment functionality
- Mobile-responsive layouts

**Phase 2 - Scheduling (2 weeks)**
- Calendar views and filtering
- Availability management
- Conflict detection
- Bulk operations

**Phase 3 - PWA Features (1-2 weeks)**
- Service worker implementation
- Push notifications
- Offline mode
- Install prompts

**Phase 4 - Enhanced Features (2 weeks)**
- Map integration
- Reporting dashboard
- CSV import/export
- Calendar app integration

### Security Rules
- Managers can read/write all collections
- Staff can only read jobs they're assigned to
- Staff can update own profile and availability
- All writes validated against schema
- Rate limiting on API calls

### Deployment
- Build command: `npm run build` (generates static files)
- Output directory: `build/`
- Environment variables: Firebase config only
- CI/CD: GitHub Actions → Firebase Hosting

## Success Metrics
- Sub-5 second load times
- 95% PWA Lighthouse score
- Works offline for core features
- Zero runtime server costs (Firebase free tier compatible)
- Supports 100+ concurrent users
