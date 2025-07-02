# EduTrack LMS - Cloud Deployment

## Environment Variables Required

Create `.env` file with:

```env
# Database Configuration
DB_HOST=your-cloud-db-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=edutrack_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=production
PORT=5000

# CORS Configuration
CLIENT_URL=https://your-frontend-domain.com
```

## Deployment Commands

### For Heroku:
```bash
# Install Heroku CLI, then:
heroku create your-edutrack-app
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
# Add other env vars
git push heroku main
```

### For Railway:
```bash
# Connect GitHub repo to Railway
# Add environment variables in Railway dashboard
# Deploy automatically on push
```

### For Vercel (Serverless):
```bash
npm i -g vercel
vercel --prod
```

## Database Setup

1. **Cloud Database Options:**
   - PlanetScale (MySQL)
   - AWS RDS
   - Google Cloud SQL
   - Railway Database

2. **Run SQL setup:**
   - Import your database schema
   - Seed initial data (roles, admin user)

## Scripts Available

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest",
  "build": "npm install"
}
```
