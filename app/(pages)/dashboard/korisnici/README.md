# Admin Dashboard - Korisnici

This is an admin dashboard for managing users from Clerk.

## Features

- **User Management**: View all users from Clerk in a table format
- **Role-based Access**: Only users with `admin` role in their `publicMetadata` can access
- **Search & Filter**: Search users by name/email and filter by role
- **User Stats**: Display statistics about user counts and activity
- **User Actions**: Dropdown menu for user management actions (placeholder)

## Setup

1. Make sure you have Clerk configured in your app
2. Set a user's `publicMetadata.role` to `"admin"` in Clerk dashboard
3. Access the page at `/dashboard/korisnici`

## Setting Admin Role

To make a user an admin:
1. Go to your Clerk Dashboard
2. Navigate to Users
3. Select the user you want to make admin
4. Go to the "Metadata" tab
5. Add to Public metadata: `{"role": "admin"}`

## API Endpoint

The dashboard uses `/api/admin/users` endpoint which:
- Checks if the current user is authenticated
- Verifies admin role from `publicMetadata`
- Fetches all users from Clerk
- Returns transformed user data

## Components Used

- Table component for user display
- Card components for stats
- Badge components for role display
- Avatar components for user images
- Dropdown menus for actions
- Search and filter functionality

## Security

- **Middleware Protection**: Admin routes are protected at the middleware level
- **Server-side Verification**: API endpoints verify authentication
- **Role-based Access**: Only users with `publicMetadata.role === "admin"` can access
- **Automatic Redirects**: Non-admin users are redirected to `/unauthorized` page
- **Protected Routes**: `/dashboard/korisnici` and `/api/admin/*` are admin-only

## Middleware Configuration

The middleware automatically:
1. Protects all non-public routes with authentication
2. Checks admin role for admin-specific routes
3. Redirects non-admin users to unauthorized page
4. Allows public access to home, pricing, auth, and unauthorized pages
