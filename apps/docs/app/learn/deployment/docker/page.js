import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Docker Deployment - Clarity Chat',
    description: 'Self-host Clarity Chat with Docker and Docker Compose.',
};
export default function DockerDeploymentPage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Deployment" }), _jsx("h1", { children: "Docker Deployment" }), _jsx("p", { className: "docs-lead", children: "Deploy Clarity Chat with Docker for self-hosted, containerized production environments." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Quick Start" }), _jsx("pre", { children: _jsx("code", { children: `# Clone starter
git clone https://github.com/clarity-chat/docker-starter
cd docker-starter

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Access at http://localhost:3000` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Dockerfile" }), _jsx("p", { children: "Multi-stage build for optimal image size:" }), _jsx("pre", { children: _jsx("code", { children: `# Dockerfile
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder stage
FROM base AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]` }) }), _jsx(Callout, { type: "info", title: "Image Size", children: "This multi-stage build reduces the final image from ~1GB to ~150MB." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Docker Compose" }), _jsx("p", { children: "Complete stack with Redis and PostgreSQL:" }), _jsx("pre", { children: _jsx("code", { children: `# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/clarity_chat
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=\${NEXTAUTH_SECRET}
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=clarity_chat
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Nginx Configuration" }), _jsx("pre", { children: _jsx("code", { children: `# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=global_limit:10m rate=100r/s;

    server {
        listen 80;
        server_name yourdomain.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        client_max_body_size 10M;

        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

        # Static files
        location /_next/static {
            proxy_pass http://app;
            proxy_cache_valid 200 365d;
            add_header Cache-Control "public, immutable";
        }

        # API routes with streaming
        location /api {
            limit_req zone=api_limit burst=20 nodelay;
            
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Streaming support
            proxy_cache off;
            proxy_buffering off;
            chunked_transfer_encoding on;
            proxy_read_timeout 300s;
        }

        # All other requests
        location / {
            limit_req zone=global_limit burst=50 nodelay;
            
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Production Deployment" }), _jsx("h3", { children: "Build and Push to Registry" }), _jsx("pre", { children: _jsx("code", { children: `# Build image
docker build -t clarity-chat:latest .

# Tag for registry
docker tag clarity-chat:latest registry.yourdomain.com/clarity-chat:latest

# Push to registry
docker push registry.yourdomain.com/clarity-chat:latest` }) }), _jsx("h3", { children: "Deploy to Server" }), _jsx("pre", { children: _jsx("code", { children: `# SSH into server
ssh user@yourserver.com

# Pull latest image
docker pull registry.yourdomain.com/clarity-chat:latest

# Update deployment
docker-compose pull
docker-compose up -d

# Clean up old images
docker image prune -af` }) }), _jsx("h3", { children: "Zero-Downtime Deployment" }), _jsx("pre", { children: _jsx("code", { children: `# Deploy new version alongside old
docker-compose up -d --scale app=2 --no-recreate

# Wait for health check
sleep 10

# Remove old containers
docker-compose up -d --scale app=1 --remove-orphans` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Environment Variables" }), _jsx("pre", { children: _jsx("code", { children: `# .env
NODE_ENV=production

# OpenAI
OPENAI_API_KEY=sk-...

# Database
DATABASE_URL=postgresql://user:pass@db:5432/clarity_chat

# Redis
REDIS_URL=redis://redis:6379

# Auth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# Optional: Vector DB
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=clarity-chat

# Optional: S3 for file uploads
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=clarity-chat-uploads` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Health Checks" }), _jsx("pre", { children: _jsx("code", { children: `# Add to docker-compose.yml
services:
  app:
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s` }) }), _jsx("pre", { children: _jsx("code", { children: `// app/api/health/route.ts
export async function GET() {
  // Check dependencies
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    openai: await checkOpenAI()
  }

  const healthy = Object.values(checks).every(Boolean)

  return Response.json(
    { status: healthy ? 'healthy' : 'unhealthy', checks },
    { status: healthy ? 200 : 503 }
  )
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Monitoring & Logging" }), _jsx("h3", { children: "Centralized Logging" }), _jsx("pre", { children: _jsx("code", { children: `# docker-compose.logging.yml
version: '3.8'

services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Optional: Loki for log aggregation
  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml
      - loki_data:/loki

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  loki_data:
  grafana_data:` }) }), _jsx("h3", { children: "Prometheus Metrics" }), _jsx("pre", { children: _jsx("code", { children: `# Add Prometheus
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

volumes:
  prometheus_data:` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Backup & Recovery" }), _jsx("h3", { children: "Database Backup" }), _jsx("pre", { children: _jsx("code", { children: `#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups

# Backup PostgreSQL
docker exec clarity_db pg_dump -U postgres clarity_chat > \
  $BACKUP_DIR/db_$DATE.sql

# Backup Redis
docker exec clarity_redis redis-cli --rdb /data/dump_$DATE.rdb

# Compress and upload to S3
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz \
  $BACKUP_DIR/db_$DATE.sql \
  $BACKUP_DIR/dump_$DATE.rdb

aws s3 cp $BACKUP_DIR/backup_$DATE.tar.gz \
  s3://your-backup-bucket/

# Keep only last 7 days
find $BACKUP_DIR -mtime +7 -delete` }) }), _jsx("h3", { children: "Restore from Backup" }), _jsx("pre", { children: _jsx("code", { children: `#!/bin/bash
# restore.sh

BACKUP_FILE=$1

# Extract backup
tar -xzf $BACKUP_FILE

# Restore PostgreSQL
docker exec -i clarity_db psql -U postgres clarity_chat < db_*.sql

# Restore Redis
docker cp dump_*.rdb clarity_redis:/data/dump.rdb
docker restart clarity_redis` }) }), _jsx("h3", { children: "Automated Backups" }), _jsx("pre", { children: _jsx("code", { children: `# Add to crontab
0 2 * * * /path/to/backup.sh  # Daily at 2am
0 0 * * 0 /path/to/weekly_backup.sh  # Weekly on Sunday` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Security Hardening" }), _jsx("h3", { children: "Non-Root User" }), _jsx("pre", { children: _jsx("code", { children: `# Already in Dockerfile
RUN adduser --system --uid 1001 nextjs
USER nextjs` }) }), _jsx("h3", { children: "Secret Management" }), _jsx("pre", { children: _jsx("code", { children: `# Use Docker Secrets
version: '3.8'

services:
  app:
    secrets:
      - openai_api_key
      - nextauth_secret
    environment:
      - OPENAI_API_KEY_FILE=/run/secrets/openai_api_key
      - NEXTAUTH_SECRET_FILE=/run/secrets/nextauth_secret

secrets:
  openai_api_key:
    file: ./secrets/openai_api_key.txt
  nextauth_secret:
    file: ./secrets/nextauth_secret.txt` }) }), _jsx("h3", { children: "Network Isolation" }), _jsx("pre", { children: _jsx("code", { children: `# Isolate services
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

services:
  app:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend  # Not exposed to internet
  
  nginx:
    networks:
      - frontend  # Only nginx exposed` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Scaling" }), _jsx("h3", { children: "Horizontal Scaling" }), _jsx("pre", { children: _jsx("code", { children: `# Scale app containers
docker-compose up -d --scale app=3

# Use Docker Swarm for orchestration
docker swarm init
docker stack deploy -c docker-compose.yml clarity-chat` }) }), _jsx("h3", { children: "Load Balancing" }), _jsx("pre", { children: _jsx("code", { children: `# docker-compose.swarm.yml
version: '3.8'

services:
  app:
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Kubernetes Alternative" }), _jsx("p", { children: "For larger deployments, consider Kubernetes:" }), _jsx("pre", { children: _jsx("code", { children: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: clarity-chat
spec:
  replicas: 3
  selector:
    matchLabels:
      app: clarity-chat
  template:
    metadata:
      labels:
        app: clarity-chat
    spec:
      containers:
      - name: app
        image: registry.yourdomain.com/clarity-chat:latest
        ports:
        - containerPort: 3000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: clarity-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Troubleshooting" }), _jsx("h3", { children: "Container Won't Start" }), _jsx("pre", { children: _jsx("code", { children: `# View logs
docker-compose logs app

# Check if port is in use
lsof -i :3000

# Restart containers
docker-compose restart

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d` }) }), _jsx("h3", { children: "Out of Memory" }), _jsx("pre", { children: _jsx("code", { children: `# Check memory usage
docker stats

# Increase memory limit
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G` }) }), _jsx("h3", { children: "Slow Performance" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Use production builds (", _jsx("code", { children: "NODE_ENV=production" }), ")"] }), _jsx("li", { children: "Enable Redis caching" }), _jsx("li", { children: "Optimize Docker image layers" }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "--network=host" }), " for better network performance"] })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/learn/deployment/vercel", className: "docs-card", children: [_jsx("h3", { children: "Deploy to Vercel" }), _jsx("p", { children: "Managed hosting" })] }), _jsxs("a", { href: "/learn/deployment/aws", className: "docs-card", children: [_jsx("h3", { children: "Deploy to AWS" }), _jsx("p", { children: "Lambda & ECS deployment" })] }), _jsxs("a", { href: "/learn/troubleshooting", className: "docs-card", children: [_jsx("h3", { children: "Troubleshooting" }), _jsx("p", { children: "Common issues" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map