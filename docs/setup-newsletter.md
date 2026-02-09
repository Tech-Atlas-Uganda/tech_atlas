# Newsletter Subscription Setup

## Supabase Database Setup

To enable the newsletter subscription feature, you need to run the SQL script in your Supabase database.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project: `opjxkfzofuqzijkvinzd`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Newsletter Table Creation Script**
   - Copy the contents of `drizzle/newsletter_subscriptions.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify the Table**
   - Go to "Table Editor" in the left sidebar
   - You should see a new table called `newsletter_subscriptions`

### Table Structure:
- `id`: Primary key (auto-increment)
- `email`: Unique email address (required)
- `subscribed_at`: Timestamp when user subscribed
- `is_active`: Boolean flag for active subscriptions
- `unsubscribed_at`: Timestamp when user unsubscribed (nullable)
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

### Security:
- Row Level Security (RLS) is enabled
- Public users can subscribe (insert)
- Public users can read subscriptions
- Public users can update their own subscriptions (for unsubscribe)

### Usage:
The newsletter subscription form is now available in the footer of all pages (except Home which has its own footer). Users can:
- Subscribe with their email
- Get success/error messages
- Duplicate emails are handled gracefully
- Email validation is performed client-side

## JWT Secret

A secure JWT secret has been generated and added to your `.env` file:
```
JWT_SECRET=your_generated_jwt_secret_here
```

## Fixed Routing Issues

✅ **Jobs Page**: Fixed "Post Opportunity" button to link to `/submit/job` instead of `/jobs/post`
✅ **All other pages**: Verified correct routing for submit buttons
✅ **Footer**: Enhanced with better design and newsletter subscription
✅ **JWT Secret**: Generated secure 128-character secret

The app should now work without 404 errors on the submit buttons!