# Deploy CrewHub to Firebase Hosting

Follow these steps to deploy your app to Firebase Hosting.

## Prerequisites
✅ Firebase CLI installed
✅ Firebase project created (crewhub-c0aca)
✅ App running locally at http://localhost:5173

## Step-by-Step Deployment

### Step 1: Login to Firebase

Open a new terminal in the CrewHub directory and run:

```bash
firebase login
```

This will:
- Open your browser
- Ask you to sign in with your Google account
- Grant Firebase CLI access

### Step 2: Initialize Firebase

```bash
firebase init
```

When prompted, select:

**Which Firebase features do you want to set up?**
- [x] Firestore (press Space to select)
- [x] Hosting (press Space to select)
- Press Enter to continue

**Please select an option:**
- Choose: **Use an existing project**

**Select a default Firebase project:**
- Choose: **crewhub-c0aca**

**Firestore Setup:**
- What file should be used for Firestore Rules?
  - Press Enter (use `firestore.rules` - already exists)
- What file should be used for Firestore indexes?
  - Press Enter (use `firestore.indexes.json`)

**Hosting Setup:**
- What do you want to use as your public directory?
  - Type: `build` and press Enter
- Configure as a single-page app?
  - Type: `y` and press Enter
- Set up automatic builds and deploys with GitHub?
  - Type: `n` and press Enter
- File build/index.html already exists. Overwrite?
  - Type: `n` and press Enter (if this appears)

### Step 3: Enable Firebase Services

Before deploying, you need to enable Authentication and Firestore:

#### Enable Authentication
1. Go to: https://console.firebase.google.com/project/crewhub-c0aca/authentication
2. Click **Get started**
3. Click **Sign-in method** tab
4. Click on **Email/Password**
5. Toggle **Enable**
6. Click **Save**

#### Create Firestore Database
1. Go to: https://console.firebase.google.com/project/crewhub-c0aca/firestore
2. Click **Create database**
3. Select **Start in production mode**
4. Choose a location (e.g., `us-central1` or closest to you)
5. Click **Enable**
6. Wait for database to be created (~1 minute)

### Step 4: Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

You should see:
```
✔  Deploy complete!
```

### Step 5: Build the Application

Stop the dev server (Ctrl+C if running) and build the app:

```bash
npm run build
```

This will create a `build/` directory with your production-ready static files.

### Step 6: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

You should see output like:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/crewhub-c0aca/overview
Hosting URL: https://crewhub-c0aca.web.app
```

### Step 7: Test Your Deployed App

1. Open the Hosting URL: **https://crewhub-c0aca.web.app**
2. Create a manager account
3. Create some jobs
4. Create a staff account (in incognito mode)
5. Assign staff to jobs
6. Test all features!

## Complete Deployment Command (After Initial Setup)

Once you've done the initial setup, future deployments are simple:

```bash
# Build the app
npm run build

# Deploy everything
firebase deploy
```

Or deploy just hosting:

```bash
npm run build && firebase deploy --only hosting
```

## Troubleshooting

### "Error: HTTP Error: 403, Permission denied"
- Make sure you're logged into the correct Google account
- Run `firebase login --reauth` to re-authenticate
- Verify you have owner/editor access to the Firebase project

### "Authentication not enabled" errors
- Go to Firebase Console → Authentication
- Enable Email/Password sign-in method

### "Missing or insufficient permissions" in Firestore
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check that rules file exists and is valid

### Build errors
- Delete `.svelte-kit/` folder: `rm -rf .svelte-kit`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Try building again: `npm run build`

### Changes not appearing
- Clear browser cache
- Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Wait a few minutes for CDN to update

## Custom Domain (Optional)

To use your own domain:

1. Go to Firebase Console → Hosting
2. Click **Add custom domain**
3. Follow the instructions to verify and connect your domain
4. Firebase will provide DNS records to add to your domain registrar

## Environment Variables

Your production environment variables are already configured in `.env`.
They are compiled into the static build, so no additional configuration needed!

## Monitoring

After deployment, monitor your app:

1. **Firebase Console**: https://console.firebase.google.com/project/crewhub-c0aca
   - View hosting metrics
   - Check Firestore usage
   - Monitor authentication

2. **Analytics** (if enabled):
   - View user engagement
   - Track page views
   - Monitor performance

## Production Checklist

Before going live:
- [ ] Authentication enabled in Firebase Console
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] App builds without errors
- [ ] All features tested locally
- [ ] Test manager account created
- [ ] Test staff account created
- [ ] Jobs can be created and assigned
- [ ] Staff can view schedules
- [ ] Mobile responsiveness verified
- [ ] PWA icons added (optional but recommended)

## Your Deployment URLs

**Project Console**: https://console.firebase.google.com/project/crewhub-c0aca/overview
**Hosting URL**: https://crewhub-c0aca.web.app
**Authentication**: https://console.firebase.google.com/project/crewhub-c0aca/authentication
**Firestore**: https://console.firebase.google.com/project/crewhub-c0aca/firestore

## Need Help?

- Firebase Hosting Docs: https://firebase.google.com/docs/hosting
- Firebase CLI Reference: https://firebase.google.com/docs/cli
- Check `README.md` for more information

---

## Quick Reference

```bash
# Login to Firebase
firebase login

# Initialize project (first time only)
firebase init

# Build the app
npm run build

# Deploy to Firebase
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View deployment
firebase open hosting:site
```

**Your app will be live at**: https://crewhub-c0aca.web.app

Good luck! 🚀
