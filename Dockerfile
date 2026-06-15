# syntax=docker/dockerfile:1.7

# ─── stage 1: build ───────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

# install deps WITHOUT postinstall scripts (supply-chain hardening),
# then explicitly rebuild only the known-good native binaries
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && \
    npm rebuild sharp esbuild

# copy source + build static site
COPY . .
RUN npm run build

# ─── stage 2: nginx ───────────────────────────────────────
FROM nginx:alpine AS runtime

# replace default config
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy built static site
COPY --from=builder /app/dist /usr/share/nginx/html

# media will be mounted as a volume at /usr/share/nginx/html/media

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
