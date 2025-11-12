# CrewHub - Staff Scheduling & Job Assignment PWA

A Progressive Web Application for managing distributed workforce scheduling and job assignments. Built with SvelteKit and Firebase.

## Features

### Manager Portal
- ✅ Create and manage job listings with location, date/time, and requirements
- ✅ Assign staff to jobs based on availability and skills
- ✅ View real-time staff availability and scheduling conflicts
- ✅ Track job completion and status
- ✅ Manage staff profiles and view team overview

### Staff Portal
- ✅ View personal schedule and upcoming assignments
- ✅ Access job details including location, time, and requirements
- ✅ Get directions to job sites via Google Maps
- ✅ Manage personal profile and skills
- ✅ View assignment history

## Tech Stack

- **Frontend**: SvelteKit with static adapter
- **Backend**: Firebase (Firestore, Auth, Storage)
- **UI**: Tailwind CSS, Lucide Icons
- **Utilities**: date-fns for date manipulation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (free tier works)

### Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

2. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable "Email/Password" provider

3. Create **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
   - Deploy the security rules from `firestore.rules`:
     ```bash
     firebase deploy --only firestore:rules
     ```

4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click the web icon (</>)
   - Register your app and copy the config values

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd CrewHub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in your Firebase configuration in `.env`:
   ```env
   PUBLIC_FIREBASE_API_KEY=your-api-key
   PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   PUBLIC_FIREBASE_APP_ID=your-app-id
   PUBLIC_MAPBOX_TOKEN=your-mapbox-token (optional, for enhanced maps)
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

The built files will be in the `build/` directory, ready to deploy to any static hosting service.

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase hosting:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### Other Static Hosts

The `build/` directory can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file hosting service

## Project Structure

```
CrewHub/
├── src/
│   ├── lib/
│   │   ├── firebase.ts          # Firebase initialization
│   │   ├── types.ts             # TypeScript type definitions
│   │   ├── stores/
│   │   │   └── auth.ts          # Authentication stores
│   │   └── services/
│   │       ├── auth.ts          # Authentication service
│   │       ├── user.ts          # User management service
│   │       └── job.ts           # Job management service
│   ├── routes/
│   │   ├── +layout.svelte       # Root layout
│   │   ├── +page.svelte         # Landing page
│   │   ├── auth/
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── manager/
│   │   │   ├── dashboard/       # Manager dashboard
│   │   │   ├── jobs/            # Job management
│   │   │   └── staff/           # Staff management
│   │   └── staff/
│   │       ├── dashboard/       # Staff schedule view
│   │       └── profile/         # Staff profile
│   ├── app.html                 # HTML template
│   └── app.css                  # Global styles
├── static/
│   └── manifest.json            # PWA manifest
├── firestore.rules              # Firestore security rules
├── svelte.config.js             # SvelteKit configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── package.json
```

## User Roles

### Manager
- Full access to create, view, edit, and delete jobs
- Assign staff to jobs
- View all staff members and their profiles
- Access to reporting and analytics

### Staff
- View personal schedule and assignments
- Update personal profile and skills
- Access job details and locations
- View assignment history

## Security

- Firestore security rules enforce role-based access control
- Managers can access all data
- Staff can only access their own assignments and profile
- All authentication handled by Firebase Auth

## Future Enhancements (Phase 3-4)

- [ ] Service worker for offline functionality
- [ ] Push notifications for new assignments
- [ ] Calendar integration (iCal/Google Calendar export)
- [ ] Map integration with Mapbox
- [ ] Reporting dashboard with analytics
- [ ] CSV import/export for bulk operations
- [ ] Availability management
- [ ] Conflict detection

## Development

### Type Checking
```bash
npm run check
```

### Watch Mode with Type Checking
```bash
npm run check:watch
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the AGPL-3.0 License.

## Support

For issues and questions, please open an issue on GitHub.
