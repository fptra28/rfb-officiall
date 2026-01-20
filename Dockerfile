# =========================
# Build stage (Alpine)
# =========================
FROM node:22-alpine AS builder
WORKDIR /app

# Build-time env (NEXT_PUBLIC_* is baked into the client bundle)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_DEV_URL
ARG NEXT_PUBLIC_IMAGE_HOSTNAME
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_URL

ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED
ARG NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG
ARG NEXT_PUBLIC_FIREBASE_ANALYTICS_LOG

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL \
    NEXT_PUBLIC_DEV_URL=$NEXT_PUBLIC_DEV_URL \
    NEXT_PUBLIC_IMAGE_HOSTNAME=$NEXT_PUBLIC_IMAGE_HOSTNAME \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_IMAGE_URL \
    NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID \
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID \
    NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED=$NEXT_PUBLIC_FIREBASE_ANALYTICS_ENABLED \
    NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG=$NEXT_PUBLIC_FIREBASE_ANALYTICS_DEBUG \
    NEXT_PUBLIC_FIREBASE_ANALYTICS_LOG=$NEXT_PUBLIC_FIREBASE_ANALYTICS_LOG

# Tools untuk native deps + glibc compat (buat lib prebuilt)
RUN apk add --no-cache python3 make g++ libc6-compat

# copy lockfile dulu biar cache build efektif
COPY package*.json ./

# NPM resiliency + fallback mirror (hindari timeout)
# - NO audit/fund
# - Retries & timeout diperbesar
RUN npm config set fund false \
 && npm config set audit false \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-timeout 600000 \
 && npm config set registry https://registry.npmjs.org/ \
 && ( npm ci --no-audit --no-fund || (npm config set registry https://registry.npmmirror.com/ && npm ci --no-audit --no-fund) )

# build app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# =========================
# Runtime stage (production)
# =========================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# compat glibc kalau ada prebuilt binaries
RUN apk add --no-cache libc6-compat

# >>> Tanpa network install di tahap ini <<<
# Bawa node_modules hasil builder, lalu prune dev deps (OFFLINE)
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Bawa hasil build & file pendukung
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/package*.json ./

EXPOSE 3000
USER node
CMD ["npm", "start"]
