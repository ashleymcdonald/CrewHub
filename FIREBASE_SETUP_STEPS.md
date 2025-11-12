# Firebase Setup Steps for CrewHub

Your Firebase project: **crewhub-c0aca**

## ✅ Step 1: Configuration Done!
Your `.env` file is now configured with your Firebase credentials.

## 📋 Step 2: Enable Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **crewhub-c0aca**
3. In the left sidebar, click **Authentication**
4. Click **Get started** (if you haven't already)
5. Click on **Sign-in method** tab
6. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle the first switch to **Enable**
   - Click **Save**

## 📋 Step 3: Create Firestore Database

1. In the Firebase Console, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in production mode**
4. Select a location (choose one closest to you):
   - For US: `us-central1`
   - For Europe: `europe-west1`
   - For Asia: Choose nearest region
5. Click **Enable**
6. Wait for the database to be created (takes ~1 minute)

## 📋 Step 4: Deploy Security Rules

Open a terminal and run these commands:

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# When prompted, select:
# - Firestore: Configure security rules and indexes
# - Hosting: Configure files for Firebase Hosting
#
# Use existing project: crewhub-c0aca
# Firestore rules file: firestore.rules (already exists)
# Firestore indexes file: firestore.indexes.json (press Enter for default)
# Public directory: build
# Configure as single-page app: Yes
# Set up automatic builds: No

# Deploy the security rules
firebase deploy --only firestore:rules
```

## 📋 Step 5: Start the Development Server

```bash
# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## 🧪 Step 6: Test the Application

### Create a Manager Account
1. Click **Get Started** or **Sign Up**
2. Fill in:
   - Name: Your Name
   - Email: manager@example.com
   - Phone: (optional)
   - Account Type: **Manager**
   - Password: Choose a secure password
3. Click **Create Account**

### Create a Staff Account
1. Open an incognito/private browser window
2. Go to [http://localhost:5173](http://localhost:5173)
3. Click **Sign Up**
4. Fill in:
   - Name: Staff Member
   - Email: staff@example.com
   - Account Type: **Staff Member**
   - Password: Choose a secure password
5. Click **Create Account**

### Test Manager Features
1. Sign in as the manager
2. Create a new job from the dashboard
3. Go to Staff page to see your staff member
4. Open the job details and assign the staff member
5. Publish the job

### Test Staff Features
1. Sign in as the staff member
2. View the assigned job on your dashboard
3. Click "Get Directions" to test maps integration
4. Update your profile and add some skills

## 🚀 Step 7: Deploy to Production (Optional)

When you're ready to deploy:

```bash
# Build the application
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

Your app will be live at:
**https://crewhub-c0aca.web.app**

## 🔧 Troubleshooting

### "Permission denied" errors
- Make sure you deployed the security rules: `firebase deploy --only firestore:rules`
- Check that the user has the correct role in Firestore

### "Firebase: Error (auth/...)"
- Verify Email/Password auth is enabled in Firebase Console
- Check that the email isn't already registered

### App not loading
- Verify all environment variables are set in `.env`
- Restart the dev server after changing `.env`
- Check browser console for errors

## ✅ Checklist

- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Security rules deployed
- [ ] Dev server running
- [ ] Manager account created
- [ ] Staff account created
- [ ] Jobs can be created
- [ ] Staff can be assigned
- [ ] Staff can view assignments

## 🎉 You're All Set!

Once all steps are complete, your CrewHub app is fully functional and ready to use!

Need help? Check the other documentation files:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Quick reference
- `IMPLEMENTATION_SUMMARY.md` - Feature overview
