# Deployment Guide

## Architecture

- **Domain**: tutor.marcchesnel.com
- **Backend**: Docker container on port 8000
- **Frontend**: Docker container on port 3000
- **Nginx**: Reverse proxy with SSL (Let's Encrypt)
- **Auto-deploy**: GitHub Actions on push to master

## Initial Setup (One-time)

### 1. Add GitHub Secrets

Go to your GitHub repo → Settings → Secrets → Actions, add:

```
SERVER_HOST=116.203.191.168
DEPLOY_USER=deployer
DEPLOY_SSH_KEY=<contents of C:/Users/dspiv/.ssh/deployer private key>
OPENAI_API_KEY=your-openai-api-key
SECRET_KEY=your-strong-secret-key
```

**To get DEPLOY_SSH_KEY:** Run `cat C:/Users/dspiv/.ssh/deployer` and copy the entire output.

**Note:** The `deployer` user can be reused for ALL your projects with the same SSH key.

### 2. Add DNS Record

Add A record in Cloudflare:
- **Name**: tutor
- **Type**: A
- **Value**: 116.203.191.168
- **Proxy**: OFF (orange cloud disabled)

### 3. First Deployment

Push to master branch:

```bash
git add .
git commit -m "Setup deployment"
git push origin master
```

GitHub Actions will:
1. SSH into your server
2. Clone the repo to `/var/www/ai-knowledge-tutor`
3. Create `.env` file with secrets
4. Build and start Docker containers
5. Setup nginx config and SSL certificate

## Security

**Deployment User**: A dedicated `deployer` user with minimal sudo permissions:
- Can run Docker commands
- Can manage nginx (reload/restart)
- Can run certbot for SSL
- Cannot access root or other system functions
- SSH key authentication only (no password)

## Manual Deployment (Alternative)

### On Server (as deployer user)

```bash
# SSH into server as deployer
ssh -i C:/Users/dspiv/.ssh/deployer deployer@116.203.191.168

# Clone repo
cd /var/www/ai-knowledge-tutor
git clone https://github.com/mcpolo78/ai-knowledge-tutor.git .

# Create .env file
cat > .env <<EOF
OPENAI_API_KEY=your-openai-api-key
SECRET_KEY=your-secret-key
REACT_APP_API_URL=https://tutor.marcchesnel.com
EOF

# Build and start (deployer is in docker group, no sudo needed)
docker-compose up -d --build

# Setup nginx (first time only, needs sudo)
sudo cp deployment/nginx-tutor.marcchesnel.com /etc/nginx/sites-available/tutor.marcchesnel.com
sudo ln -sf /etc/nginx/sites-available/tutor.marcchesnel.com /etc/nginx/sites-enabled/

# Get SSL certificate (needs sudo)
sudo certbot --nginx -d tutor.marcchesnel.com --non-interactive --agree-tos --email marc@marcchesnel.com

# Reload nginx (needs sudo)
sudo nginx -t && sudo systemctl reload nginx
```

## Updating

### Auto (Recommended)

Just push to master:

```bash
git push origin master
```

### Manual

```bash
ssh -i C:/Users/dspiv/.ssh/deployer deployer@116.203.191.168
cd /var/www/ai-knowledge-tutor
git pull origin master
docker-compose up -d --build
```

## Accessing the App

- **Frontend**: https://tutor.marcchesnel.com
- **Backend API**: https://tutor.marcchesnel.com/api/v1/
- **API Docs**: https://tutor.marcchesnel.com/docs

## Monitoring

```bash
# View logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Check status
docker-compose ps
```

## Troubleshooting

### Container not starting
```bash
docker-compose down
docker-compose up -d
docker-compose logs
```

### SSL issues
```bash
certbot renew --dry-run
certbot certificates
```

### Nginx issues
```bash
nginx -t
systemctl status nginx
```

### Database reset
```bash
cd /var/www/ai-knowledge-tutor/backend
docker-compose exec backend python init_database.py
```

## Environment Variables

**.env** (server only):
```
OPENAI_API_KEY=sk-...
SECRET_KEY=your-secret-key
REACT_APP_API_URL=https://tutor.marcchesnel.com
```

## Ports Used

- **3000**: Frontend (nginx → Docker)
- **8000**: Backend (nginx → Docker)

These ports are internal only, exposed via nginx reverse proxy on 443 (HTTPS).
