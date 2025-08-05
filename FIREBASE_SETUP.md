# Firebase Setup Guide

## Required Indexes

To avoid Firestore query errors, you need to create the following composite indexes:

### 1. Users Collection Index
**Collection:** `users`
**Fields:**
- `role` (Ascending)
- `totalScore` (Descending)

**Steps to create:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database
4. Click on "Indexes" tab
5. Click "Create Index"
6. Set Collection ID to `users`
7. Add fields:
   - `role` (Ascending)
   - `totalScore` (Descending)
8. Click "Create"

### 2. Questions Collection Index (if needed)
**Collection:** `questions`
**Fields:**
- `categoryId` (Ascending)
- `difficulty` (Ascending)

**Steps to create:**
1. Follow the same steps as above
2. Set Collection ID to `questions`
3. Add fields:
   - `categoryId` (Ascending)
   - `difficulty` (Ascending)
4. Click "Create"

## Alternative Solution

If you don't want to create indexes right now, the code has been updated to handle missing indexes gracefully:

- **Leaderboard queries** will fall back to client-side filtering
- **Question queries** will work without indexes
- **No errors** will be thrown to users

## Security Rules

Make sure your Firestore security rules allow the necessary operations:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null; // For leaderboard
    }
    
    // Categories are readable by all authenticated users
    match /categories/{categoryId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Questions are readable by all authenticated users
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Quizzes are readable/writable by authenticated users
    match /quizzes/{quizId} {
      allow read, write: if request.auth != null;
    }
    
    // User progress is readable/writable by authenticated users
    match /userProgress/{progressId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Authentication Setup

In Firebase Console:

1. **Enable Authentication Methods:**
   - Email/Password
   - Google (optional)

2. **Set up Google OAuth (if using):**
   - Go to Authentication > Sign-in method
   - Enable Google
   - Add your domain to authorized domains

## Testing

After setting up indexes:

1. **Test leaderboard:** Visit `/dashboard` and check if leaderboard loads
2. **Test questions:** Start a quiz and verify questions appear
3. **Test admin:** Visit `/admin` and check if all data loads

## Troubleshooting

### Index Creation Issues
- Wait 1-2 minutes for indexes to build
- Check the "Indexes" tab in Firebase Console
- Verify the index status shows "Enabled"

### Query Errors
- Check browser console for specific error messages
- Verify collection names match exactly
- Ensure field names match your data structure

### Authentication Issues
- Verify environment variables are correct
- Check Firebase Console > Authentication > Users
- Ensure your domain is in authorized domains

## Performance Notes

- **Indexes improve query performance** but take time to build
- **Client-side filtering** works as a fallback but is less efficient
- **Consider pagination** for large datasets
- **Monitor usage** in Firebase Console

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase Console configuration
3. Test with the `/debug` page
4. Check the `/test` page for authentication status 