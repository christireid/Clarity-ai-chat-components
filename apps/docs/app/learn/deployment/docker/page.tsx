import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Docker Deployment - Clarity Chat',
  description: 'Self-host Clarity Chat with Docker and Docker Compose.',
}

export default function DockerDeploymentPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Deployment</span>
        <h1>Docker Deployment</h1>
        <p className="docs-lead">
          Deploy Clarity Chat with Docker for self-hosted, containerized
          production environments.
        </p>
      </div>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <pre>
          <code>{`# Clone the repository
git clone https://github.com/christireid/Clarity-ai-chat-components
cd Clarity-ai-chat-components

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Access at http://localhost:3000`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Dockerfile</h2>
        <p>Multi-stage build for optimal image size:</p>
        <pre>
          <code>{`# Dockerfile
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

CMD ["node", "server.js"]`}</code>
        </pre>

        <Callout type="info" title="Image Size">
          This multi-stage build reduces the final image from ~1GB to ~150MB.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Docker Compose</h2>
        <p>Complete stack with Redis and PostgreSQL:</p>
        <pre>
          <code>{`# docker-compose.yml
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
    driver: bridge`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Nginx Configuration</h2>
        <pre>
          <code>{`# nginx.conf
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
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Production Deployment</h2>

        <h3>Build and Push to Registry</h3>
        <pre>
          <code>{`# Build image
docker build -t clarity-chat:latest .

# Tag for registry
docker tag clarity-chat:latest registry.yourdomain.com/clarity-chat:latest

# Push to registry
docker push registry.yourdomain.com/clarity-chat:latest`}</code>
        </pre>

        <h3>Deploy to Server</h3>
        <pre>
          <code>{`# SSH into server
ssh user@yourserver.com

# Pull latest image
docker pull registry.yourdomain.com/clarity-chat:latest

# Update deployment
docker-compose pull
docker-compose up -d

# Clean up old images
docker image prune -af`}</code>
        </pre>

        <h3>Zero-Downtime Deployment</h3>
        <pre>
          <code>{`# Deploy new version alongside old
docker-compose up -d --scale app=2 --no-recreate

# Wait for health check
sleep 10

# Remove old containers
docker-compose up -d --scale app=1 --remove-orphans`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Environment Variables</h2>
        <pre>
          <code>{`# .env
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
AWS_S3_BUCKET=clarity-chat-uploads`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Health Checks</h2>
        <pre>
          <code>{`# Add to docker-compose.yml
services:
  app:
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s`}</code>
        </pre>

        <pre>
          <code>{`// app/api/health/route.ts
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
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Monitoring & Logging</h2>

        <h3>Centralized Logging</h3>
        <pre>
          <code>{`# docker-compose.logging.yml
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
  grafana_data:`}</code>
        </pre>

        <h3>Prometheus Metrics</h3>
        <pre>
          <code>{`# Add Prometheus
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
  prometheus_data:`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Backup & Recovery</h2>

        <h3>Database Backup</h3>
        <pre>
          <code>{`#!/bin/bash
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
find $BACKUP_DIR -mtime +7 -delete`}</code>
        </pre>

        <h3>Restore from Backup</h3>
        <pre>
          <code>{`#!/bin/bash
# restore.sh

BACKUP_FILE=$1

# Extract backup
tar -xzf $BACKUP_FILE

# Restore PostgreSQL
docker exec -i clarity_db psql -U postgres clarity_chat < db_*.sql

# Restore Redis
docker cp dump_*.rdb clarity_redis:/data/dump.rdb
docker restart clarity_redis`}</code>
        </pre>

        <h3>Automated Backups</h3>
        <pre>
          <code>{`# Add to crontab
0 2 * * * /path/to/backup.sh  # Daily at 2am
0 0 * * 0 /path/to/weekly_backup.sh  # Weekly on Sunday`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Security Hardening</h2>

        <h3>Non-Root User</h3>
        <pre>
          <code>{`# Already in Dockerfile
RUN adduser --system --uid 1001 nextjs
USER nextjs`}</code>
        </pre>

        <h3>Secret Management</h3>
        <pre>
          <code>{`# Use Docker Secrets
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
    file: ./secrets/nextauth_secret.txt`}</code>
        </pre>

        <h3>Network Isolation</h3>
        <pre>
          <code>{`# Isolate services
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
      - frontend  # Only nginx exposed`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Scaling</h2>

        <h3>Horizontal Scaling</h3>
        <pre>
          <code>{`# Scale app containers
docker-compose up -d --scale app=3

# Use Docker Swarm for orchestration
docker swarm init
docker stack deploy -c docker-compose.yml clarity-chat`}</code>
        </pre>

        <h3>Load Balancing</h3>
        <pre>
          <code>{`# docker-compose.swarm.yml
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
          memory: 512M`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Kubernetes Alternative</h2>
        <p>For larger deployments, consider Kubernetes:</p>
        <pre>
          <code>{`# deployment.yaml
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
          periodSeconds: 5`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>Container Won't Start</h3>
        <pre>
          <code>{`# View logs
docker-compose logs app

# Check if port is in use
lsof -i :3000

# Restart containers
docker-compose restart

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d`}</code>
        </pre>

        <h3>Out of Memory</h3>
        <pre>
          <code>{`# Check memory usage
docker stats

# Increase memory limit
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G`}</code>
        </pre>

        <h3>Slow Performance</h3>
        <ul>
          <li>
            Use production builds (<code>NODE_ENV=production</code>)
          </li>
          <li>Enable Redis caching</li>
          <li>Optimize Docker image layers</li>
          <li>
            Use <code>--network=host</code> for better network performance
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/learn/deployment/vercel" className="docs-card">
            <h3>Deploy to Vercel</h3>
            <p>Managed hosting</p>
          </a>
          <a href="/learn/deployment/aws" className="docs-card">
            <h3>Deploy to AWS</h3>
            <p>Lambda & ECS deployment</p>
          </a>
          <a href="/learn/troubleshooting" className="docs-card">
            <h3>Troubleshooting</h3>
            <p>Common issues</p>
          </a>
        </div>
      </section>
    </div>
  )
}
