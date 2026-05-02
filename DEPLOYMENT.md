# Kumari Horizon: Deployment Guide

This guide covers how to deploy the Kumari Horizon portal to a production environment.

## 🐳 Docker Deployment (Recommended)

1. **Build and Run**
   ```bash
   docker-compose up --build -d
   ```

2. **Database Backup**
   Ensure your MongoDB volume is mapped correctly in `docker-compose.yml`.

## 🖥 Manual VPS Deployment

### 1. Backend (PM2)
```bash
cd backend
npm install --production
pm2 start server.js --name kumari-api
```

### 2. Frontend (Nginx)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Configure Nginx to serve the `dist` folder:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           root /path/to/kumari-horizon/frontend/dist;
           try_files $uri /index.html;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Security Checklist
- [ ] Change all JWT secrets and DB passwords for production.
- [ ] Enable SSL (Certbot/Let's Encrypt).
- [ ] Configure Razorpay webhooks to your production domain.
- [ ] Ensure `NODE_ENV` is set to `production` in `.env`.
- [ ] Disable dev logging and enable Winston error logs.

## 🧪 Health Check
The API provides a health check endpoint at `GET /`.
Response should be:
```json
{
  "name": "Kumari Horizon API",
  "version": "1.0.0",
  "status": "Operational"
}
```
