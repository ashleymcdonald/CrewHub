# CrewHub Setup Guide

## Quick Start (5 minutes)

### Step 1: Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the wizard
3. Once created, click on the web icon (</>) to add a web app
4. Copy the Firebase config values

### Step 2: Enable Firebase Services

#### Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click Save

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode**
4. Select a location (choose closest to your users)
5. Click Enable

#### Deploy Security Rules
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### Step 3: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Firebase config:
   ```env
   PUBLIC_FIREBASE_API_KEY=AIza...
   PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
   ```

### Step 4: Run the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

### Step 5: Create Your First User

1. Click "Get Started" or "Sign Up"
2. Fill in the registration form
3. Choose either "Manager" or "Staff Member" as account type
4. Click "Create Account"

**Tip**: Create at least one Manager account and one Staff account to test both portals!

## Testing the Application

### As a Manager:
1. Sign in with a manager account
2. Create a new job from the dashboard
3. Go to Staff page to view available staff
4. Assign staff to your created job
5. Publish the job

### As Staff:
1. Sign in with a staff account
2. View your assignments on the dashboard
3. Click "Get Directions" to open location in Google Maps
4. Update your profile and add skills

## Production Deployment

### Deploy to Firebase Hosting

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your app will be live at: `https://your-project-id.web.app`

### Deploy to Other Platforms

The `build/` directory contains static files that can be deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag `build/` folder to Netlify dashboard
- **GitHub Pages**: Push `build/` contents to gh-pages branch

## Adding PWA Icons

For the app to work as a PWA, add these images to the `static/` folder:
- `favicon.png` (48x48)
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

See `static/ICONS_README.md` for detailed instructions.

## Troubleshooting

### "Firebase not configured" error
- Make sure `.env` file exists and has all required variables
- Restart the dev server after changing `.env`

### "Permission denied" errors in Firestore
- Deploy the security rules: `firebase deploy --only firestore:rules`
- Make sure you're signed in with the correct account
- Check that user role is set correctly in Firestore

### Build errors
- Delete `node_modules/` and run `npm install` again
- Clear SvelteKit cache: `rm -rf .svelte-kit`

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review Firebase documentation: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- Check SvelteKit docs: [https://kit.svelte.dev/docs](https://kit.svelte.dev/docs)

## Next Steps

Once your app is running:

1. **Customize branding**: Update colors in `tailwind.config.js`
2. **Add features**: Check the "Future Enhancements" section in README
3. **Enable PWA features**: Implement service workers for offline mode
4. **Add analytics**: Integrate Firebase Analytics
5. **Set up notifications**: Implement push notifications

Happy scheduling! 🎉
