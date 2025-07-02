# TaskFlow - Cloud Deployment

## Environment Variables Required

Create `.env` file with:

```env
# Database Configuration
DB_HOST=your-cloud-db-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=taskflow_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
NODE_ENV=production
PORT=5000

# CORS Configuration
CLIENT_URL=https://your-frontend-domain.com

# Socket.IO Configuration
SOCKET_ORIGIN=https://your-frontend-domain.com
```

## Deployment Commands

### For Heroku:
```bash
heroku create your-taskflow-app
heroku config:set NODE_ENV=production
git push heroku main
```

### For Railway:
```bash
# Connect GitHub repo
# Add environment variables
# Auto-deploy on push
```

## Database Setup

1. Run `taskflow_setup.sql` on your cloud database
2. Seed initial data (admin user, sample projects)

## Real-time Features

- Socket.IO configured for cloud deployment
- CORS properly set for production
- WebSocket fallback enabled
