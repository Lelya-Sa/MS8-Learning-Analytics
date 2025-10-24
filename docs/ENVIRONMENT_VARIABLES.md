# Environment Variables Configuration

This project uses cloud environment variables for secure configuration. The following variables should be set in your cloud deployment platforms:

## Required Environment Variables

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string (Supabase)
  - Format: `postgresql://username:password@host:port/database?schema=public`
  - Example: `postgresql://postgres:password@db.example.supabase.co:5432/postgres?schema=public`

### Authentication
- `JWT_SECRET` - Secret key for JWT token signing
  - Should be a strong, random string (32+ characters)
  - Example: `your-super-secure-jwt-secret-key-change-in-production`

### Testing (Optional)
- `TEST_USER_PASSWORD` - Password for test users (testing only)
  - Used only in test environment
  - Example: `test-password-123`

## Platform-Specific Configuration

### Vercel
Set these variables in your Vercel dashboard:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`

### Railway
Set these variables in your Railway project:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`
- **Note**: Railway provides built-in caching, no Redis needed

### Supabase
The `DATABASE_URL` is automatically provided by Supabase when you connect your project.

## Security Notes

⚠️ **IMPORTANT**: Never commit these variables to version control. They are automatically injected by your cloud platform.

- All hardcoded secrets have been removed from the codebase
- JWT secrets now use cloud environment variables
- Database connections use cloud-provided URLs
- Test passwords use environment variables with fallbacks

## Local Development

For local development, create a `.env.local` file (not committed to git):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/learning_analytics?schema=public"
JWT_SECRET="your-local-jwt-secret"
NODE_ENV="development"
TEST_USER_PASSWORD="test-password-123"
```

## Production Deployment

The application automatically detects cloud environment variables and uses them for:
- Database connections
- JWT token signing
- API endpoints
- Health check URLs

No additional configuration is needed for cloud deployment.
