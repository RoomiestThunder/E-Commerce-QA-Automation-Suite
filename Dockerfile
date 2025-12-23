# Multi-stage build for test execution
FROM node:18-alpine AS base

# Install essential dependencies for Playwright
RUN apk add --no-cache \
    bash \
    curl \
    git \
    python3 \
    make \
    g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy entire project
COPY . .

# Build TypeScript
RUN npm run build 2>/dev/null || true

# Production stage
FROM node:18-alpine

# Install runtime dependencies for Playwright
RUN apk add --no-cache \
    bash \
    curl \
    dumb-init

WORKDIR /app

# Copy from base stage
COPY --from=base /app /app
COPY --from=base /root/.cache /root/.cache

# Create directories for test results
RUN mkdir -p /app/test-results \
    && mkdir -p /app/.playwright

# Set environment variables
ENV NODE_ENV=production
ENV CI=true
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD npm run test:auth --grep "Successful login" || exit 1

# Use dumb-init to properly handle signals
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Default command - run all tests
CMD ["npm", "run", "test"]
