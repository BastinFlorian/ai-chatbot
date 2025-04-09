# --- Base image avec Node.js ---
FROM node:22-alpine AS base

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    gcc

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
ARG AUTH_SECRET
ARG AZURE_API_KEY
ARG AZURE_RESOURCE_NAME
ARG PORT
ARG POSTGRES_URL
ARG AUTH_TRUST_HOST
ARG NEXT_PUBLIC_APP_URL

# Environnement pour la build
ENV AUTH_SECRET=$AUTH_SECRET \
    AZURE_API_KEY=$AZURE_API_KEY \
    AZURE_RESOURCE_NAME=$AZURE_RESOURCE_NAME \
    PORT=$PORT \
    POSTGRES_URL=$POSTGRES_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    AUTH_TRUST_HOST=$AUTH_TRUST_HOST \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
