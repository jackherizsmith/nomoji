# Nomoji - Production Deployment Guide

This guide covers deploying Nomoji to production using various platforms.

## Quick Start

The game is containerised with Docker and ready for deployment to any platform that supports Docker or Next.js.

---

## Option 1: Vercel (Recommended - Easiest)

Vercel is the easiest deployment option with built-in PostgreSQL support.

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push code to GitHub** (already done)
   ```
   Repository: https://github.com/jackherizsmith/nomoji
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import `jackherizsmith/nomoji` from GitHub
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

   In Vercel dashboard → Settings → Environment Variables, add:

   ```
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   CRON_SECRET=generate-a-secure-random-string
   ```

4. **Set up Vercel Postgres**
   - Go to Storage tab
   - Create new Postgres database
   - Copy connection string to `DATABASE_URL`
   - Or use external provider (see below)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Visit your live URL

6. **Set up Daily Game Cron**
   - Go to Settings → Cron Jobs
   - Create new cron job:
     - **Path**: `/api/create-daily`
     - **Schedule**: `0 0 * * *` (daily at midnight UTC)
     - **Headers**:
       ```
       Authorization: Bearer YOUR_CRON_SECRET
       ```

7. **Run Initial Migration**

   From your terminal:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link project
   vercel link

   # Run migration
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

---

## Option 2: Docker on VPS (DigitalOcean, AWS EC2, etc.)

Deploy using Docker on any VPS or cloud provider.

### Prerequisites
- VPS with Docker installed
- Domain name (optional but recommended)

### Steps

1. **Clone repository on server**
   ```bash
   git clone https://github.com/jackherizsmith/nomoji.git
   cd nomoji
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   nano .env.local
   ```

   Update:
   ```
   DATABASE_URL=postgresql://nomoji:SECURE_PASSWORD@postgres:5432/nomoji?schema=public
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   CRON_SECRET=generate-a-secure-random-string
   ```

3. **Update docker-compose for production**

   Edit `docker-compose.yml`:
   ```yaml
   services:
     postgres:
       environment:
         POSTGRES_PASSWORD: SECURE_PASSWORD_HERE
       volumes:
         - postgres_data:/var/lib/postgresql/data
       # Remove ports exposure for security
       # Only accessible within Docker network

     app:
       restart: always
       environment:
         DATABASE_URL: postgresql://nomoji:SECURE_PASSWORD@postgres:5432/nomoji?schema=public
         NEXT_PUBLIC_APP_URL: https://yourdomain.com
         CRON_SECRET: ${CRON_SECRET}
   ```

4. **Start containers**
   ```bash
   docker-compose up -d --build
   ```

5. **Set up Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

7. **Set up cron job**
   ```bash
   crontab -e
   ```

   Add:
   ```
   0 0 * * * curl -X POST http://localhost:3000/api/create-daily -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

---

## Option 3: Railway

Railway provides automatic deployments with built-in PostgreSQL.

### Steps

1. **Go to [railway.app](https://railway.app)**

2. **Create New Project**
   - Select "Deploy from GitHub repo"
   - Connect `jackherizsmith/nomoji`

3. **Add PostgreSQL**
   - Click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will provide `DATABASE_URL`

4. **Configure Variables**

   In project settings:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NEXT_PUBLIC_APP_URL=${{RAILWAY_STATIC_URL}}
   CRON_SECRET=generate-secure-string
   ```

5. **Deploy**
   - Railway auto-deploys on git push
   - Visit generated URL

6. **Set up Cron**

   Use external service like [cron-job.org](https://cron-job.org):
   - Schedule: Daily at 00:00 UTC
   - URL: `https://your-app.up.railway.app/api/create-daily`
   - Header: `Authorization: Bearer YOUR_CRON_SECRET`

---

## Option 4: Self-hosted with Docker Compose

Perfect for running on your own server.

### Prerequisites
- Server with Docker and Docker Compose
- PostgreSQL (or use Docker PostgreSQL)

### Steps

1. **Clone and configure**
   ```bash
   git clone https://github.com/jackherizsmith/nomoji.git
   cd nomoji
   cp .env.example .env.local
   ```

2. **Edit environment variables**
   ```bash
   nano .env.local
   ```

3. **Build and run**
   ```bash
   docker-compose up -d --build
   ```

4. **Run migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

5. **Set up reverse proxy** (Nginx, Caddy, Traefik)

6. **Configure cron** (see VPS section above)

---

## Database Providers

If you don't want to self-host PostgreSQL:

### Vercel Postgres
- Built into Vercel platform
- Easy setup
- Free tier: 256 MB storage

### Supabase
- Free tier: 500 MB storage
- Go to [supabase.com](https://supabase.com)
- Create project
- Copy connection string from Settings → Database

### Neon
- Serverless PostgreSQL
- Free tier: 0.5 GB storage
- Go to [neon.tech](https://neon.tech)
- Create database
- Copy connection string

### PlanetScale (MySQL alternative)
- Would require Prisma provider change to `mysql`

---

## Environment Variables Reference

```bash
# Database connection
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB?schema=public"

# Public app URL (for share links)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Secret for cron endpoint protection
CRON_SECRET="generate-a-long-random-string"

# Optional: Node environment
NODE_ENV="production"
```

### Generating Secure Secrets

```bash
# On Linux/Mac
openssl rand -hex 32

# Or Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment Checklist

- [ ] App loads at production URL
- [ ] Daily game API works (`/api/daily-game`)
- [ ] Can submit guesses
- [ ] Results screen shows correctly
- [ ] Share button works
- [ ] Infinite mode accessible
- [ ] Timer functions properly
- [ ] Database stores attempts
- [ ] Cron job scheduled for daily game generation
- [ ] SSL certificate installed (HTTPS)
- [ ] Custom domain configured (if applicable)
- [ ] Analytics/monitoring set up (optional)

---

## Monitoring & Maintenance

### Check Application Health

```bash
# Check if app is running
curl https://yourdomain.com

# Test daily game API
curl https://yourdomain.com/api/daily-game

# Check database
docker-compose exec postgres psql -U nomoji -d nomoji -c "SELECT COUNT(*) FROM DailyGame;"
```

### View Logs

```bash
# Docker logs
docker-compose logs app -f

# Vercel logs
vercel logs

# Railway logs
railway logs
```

### Database Backups

```bash
# Backup
docker-compose exec postgres pg_dump -U nomoji nomoji > backup.sql

# Restore
docker-compose exec -T postgres psql -U nomoji nomoji < backup.sql
```

---

## Performance Optimisation

### CDN Setup (Optional)

Use Vercel Edge Network or Cloudflare:
- Cache static assets
- Global edge distribution
- DDoS protection

### Database Indexing

Already configured in Prisma schema:
- `DailyGame.date` - Fast daily lookups
- `GameAttempt.userId` - User statistics
- `GameAttempt.gameId` - Game leaderboards
- `GameAttempt.createdAt` - Historical queries

---

## Troubleshooting

### App won't build
- Check `DATABASE_URL` is set (placeholder works for build)
- Verify Node.js version 20+
- Check build logs for errors

### Database connection fails
- Verify `DATABASE_URL` format
- Check PostgreSQL is running
- Test connection string with `psql`

### Animations not smooth
- Check browser supports CSS transforms
- Verify Framer Motion loaded correctly
- Test on different browsers

### Cron job not working
- Verify `CRON_SECRET` matches
- Check cron job is scheduled correctly
- Test endpoint manually:
  ```bash
  curl -X POST https://yourdomain.com/api/create-daily \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```

---

## Scaling

### Horizontal Scaling
- Deploy multiple app instances behind load balancer
- Use connection pooling (PgBouncer)
- Cache daily game in Redis

### Database Optimisation
- Enable query caching
- Add materialized views for leaderboards
- Archive old game attempts

---

## Security Checklist

- [ ] Change default PostgreSQL password
- [ ] Use strong `CRON_SECRET`
- [ ] Enable SSL/HTTPS
- [ ] Set up rate limiting (Cloudflare, Nginx)
- [ ] Regular dependency updates (`npm audit`)
- [ ] Database backups configured
- [ ] Monitor for suspicious activity
- [ ] CORS configured correctly

---

## Cost Estimates

### Vercel + Vercel Postgres
- **Free tier**: Covers small traffic
- **Pro tier**: $20/month (increased limits)

### Self-hosted VPS
- **DigitalOcean**: $6-12/month (basic droplet)
- **Hetzner**: €4-8/month (better value)

### Railway
- **Free tier**: $5 credit/month
- **Paid**: Usage-based pricing

---

## Support & Resources

- **GitHub Repository**: https://github.com/jackherizsmith/nomoji
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Docker Docs**: https://docs.docker.com

---

## License

MIT - Feel free to modify and deploy!
