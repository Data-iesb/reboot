# Reboot IESB 2026 — static site served by nginx
# Base image from the AWS public ECR mirror to avoid Docker Hub rate limits.
FROM public.ecr.aws/nginx/nginx:1.27-alpine

# Site content (HTML/JS/JSON + images). .dockerignore keeps k8s/build files out.
COPY . /usr/share/nginx/html/

# Custom nginx config: gzip, caching, SPA-safe fallback, health endpoint.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz || exit 1
