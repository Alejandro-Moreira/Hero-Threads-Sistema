# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Hero Threads application.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Node.js and npm installed

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Hero Threads"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses for testing)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set the following:
   - Name: "Hero Threads Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3001` (if using different port)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - `http://localhost:3001/auth/google/callback` (if using different port)

## Step 4: Get Your Credentials

After creating the OAuth client, you'll get:
- Client ID
- Client Secret

## Step 5: Environment Variables

Create a `.env` file in the backend directory with:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Other existing variables...
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

## Step 6: Install Dependencies

Make sure you have the required dependencies:

```bash
# Backend dependencies (should already be installed)
npm install

# Frontend dependencies (should already be installed)
cd ../frontend
npm install
```

## Step 7: Test the Setup

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to `http://localhost:3001/register`
4. Click "Continuar con Google"
5. Complete the OAuth flow

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Make sure the redirect URI in Google Console matches exactly
   - Check for trailing slashes or port differences

2. **"invalid_client" error**
   - Verify your Client ID and Client Secret are correct
   - Make sure you're using the right credentials

3. **CORS errors**
   - Ensure your frontend is running on the correct port
   - Check that the backend CORS configuration includes your frontend URL

4. **"access_denied" error**
   - Make sure you've added your email as a test user in the OAuth consent screen
   - Check that the required scopes are added

### Production Deployment:

For production, you'll need to:

1. Update the authorized origins and redirect URIs in Google Console
2. Use HTTPS URLs
3. Update environment variables with production URLs
4. Consider using environment-specific configurations

## Security Notes

- Never commit your `.env` file to version control
- Keep your Client Secret secure
- Use environment variables for all sensitive configuration
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Best Practices](https://tools.ietf.org/html/rfc6819) 