# Docker Quick Reference

Complete guide for running tests with Docker and Docker Compose.

## Quick Start with Docker Compose

### Run All Tests in Container

```bash
docker-compose up --build
```

This will:
1. Build the test image
2. Install dependencies
3. Install Playwright browsers
4. Run full test suite
5. Generate HTML report
6. Output test results

### Run Specific Test Suite

```bash
docker-compose run automation-tests npm run test:auth
docker-compose run automation-tests npm run test:products
docker-compose run automation-tests npm run test:cart
docker-compose run automation-tests npm run test:checkout
```

### Run Tests Interactively

```bash
docker-compose run -it automation-tests /bin/bash
npm run test:ui
```

### Run with Custom Environment Variables

```bash
BASE_URL=https://your-site.com TEST_USERNAME=user@test.com docker-compose up
```

## Docker Build and Run

### Build Docker Image

```bash
docker build -t automation-suite:latest .
```

### Run Single Execution

```bash
docker run --rm \
  -e BASE_URL=https://your-site.com \
  -e TEST_USERNAME=user@test.com \
  -e TEST_PASSWORD=password \
  -v $(pwd)/test-results:/app/test-results \
  automation-suite:latest
```

### Run in Interactive Mode

```bash
docker run -it \
  -e BASE_URL=https://your-site.com \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd):/app \
  automation-suite:latest \
  /bin/bash
```

### Run with Debugging

```bash
docker run -it \
  -e BASE_URL=https://your-site.com \
  -e LOG_LEVEL=debug \
  -e DEBUG=pw:api \
  -p 9222:9222 \
  -v $(pwd)/test-results:/app/test-results \
  automation-suite:latest
```

## Docker Compose Commands

### Complete Reference

```bash
# Build and start
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Remove volumes (cleanup)
docker-compose down -v

# View logs
docker-compose logs -f automation-tests

# Run one-off command
docker-compose run automation-tests npm run test:auth

# Execute bash
docker-compose exec automation-tests bash

# View running containers
docker-compose ps

# Restart services
docker-compose restart
```

## Environment Configuration

### Copy Environment Template

```bash
cp .env.docker .env
# Edit .env with your configuration
```

### Required Variables

```bash
BASE_URL=https://your-ecommerce-site.com
TEST_USERNAME=test@example.com
TEST_PASSWORD=secure_password_123
```

### Optional Variables

```bash
HEADLESS=true              # Run in headless mode
LOG_LEVEL=info             # Logging level: debug, info, warn, error
WORKERS=4                  # Parallel test workers
TIMEOUT=30000              # Test timeout in milliseconds
```

## Volume Mounting

### Test Results Output

```bash
# Results persist after container stops
docker-compose run -v $(pwd)/test-results:/app/test-results automation-tests
```

### Source Code Development

```bash
# Mount source for live editing (development)
docker run -v $(pwd):/app -it automation-suite:latest npm run test:ui
```

### Playwright Cache

```bash
# Use named volume for browser cache (faster subsequent runs)
docker-compose up --build
# Cache stored in Docker named volume 'playwright-cache'
```

## Performance Optimization

### Limit Resource Usage

```bash
docker run \
  --memory="1g" \
  --cpus="1.5" \
  automation-suite:latest
```

### Use Multi-Worker Parallelization

```bash
docker-compose run automation-tests npm run test -- --workers 4
```

### Cache Browser Binaries

```bash
# First run downloads and caches browsers
docker build -t automation-suite:latest .

# Subsequent runs use cached layer (much faster)
docker build --cache-from automation-suite:latest -t automation-suite:latest .
```

## Troubleshooting

### Container Won't Start

```bash
# Check build errors
docker-compose build --no-cache

# View detailed logs
docker-compose logs automation-tests

# Rebuild and start
docker-compose down && docker-compose up --build
```

### Port Already in Use

```bash
# Change port in docker-compose.yml or use dynamic port
docker-compose run -p 9222 automation-tests
```

### Out of Memory Errors

```bash
# Reduce parallel workers
docker-compose run automation-tests npm run test -- --workers 1

# Or increase Docker memory allocation
# In Docker Desktop: Preferences → Resources → Memory
```

### Browser Installation Fails

```bash
# Rebuild without cache
docker build --no-cache -t automation-suite:latest .

# Or manually install in running container
docker-compose run automation-tests npx playwright install chromium
```

### Test Results Not Persisting

```bash
# Ensure volume is properly mounted
docker-compose run -v $(pwd)/test-results:/app/test-results automation-tests

# Check permissions
ls -la test-results/
chmod -R 755 test-results/
```

## CI/CD Integration

### GitHub Actions with Docker

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and run tests
        run: |
          docker-compose build --no-cache
          docker-compose run automation-tests
      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### GitLab CI with Docker

```yaml
test:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose up --abort-on-container-exit
  artifacts:
    paths:
      - test-results/
```

## Advanced Usage

### Custom Dockerfile for CI/CD

```bash
# Build production image
docker build --build-arg NODE_ENV=production -t automation-suite:prod .

# Run with minimal resources
docker run \
  --memory="512m" \
  --cpus="0.5" \
  automation-suite:prod
```

### Network Testing

```bash
# Run with custom network
docker-compose -f docker-compose.yml -f docker-compose.network.yml up

# Test API communication
docker-compose exec automation-tests curl http://mock-api:3000/health
```

### Database Integration (Optional)

```bash
# Add service to docker-compose.yml
services:
  test-db:
    image: postgres:15
    environment:
      POSTGRES_DB: test_db
    networks:
      - test-network
```

## Cleaning Up

### Remove Containers and Images

```bash
# Stop and remove all containers
docker-compose down

# Remove all images
docker image prune -a

# Remove unused volumes
docker volume prune

# Clean everything
docker system prune -a --volumes
```

### Clear Playwright Cache

```bash
# Remove browser cache
docker volume rm automation-suite_playwright-cache

# Or delete from host
rm -rf ~/.cache/ms-playwright
```

## Performance Metrics

### Container Startup

- First run: 2-3 minutes (browser download)
- Subsequent runs: 30-60 seconds (cached browsers)

### Test Execution

- Sequential: 8-10 minutes
- Parallel (4 workers): 5-7 minutes
- Parallel (8 workers): 4-6 minutes

### Docker Image Size

- Development: ~1.2 GB
- Production: ~900 MB

## Security Best Practices

### Don't Commit Secrets

```bash
# Add to .gitignore
.env
.env.docker
test-results/
```

### Use GitHub Secrets for CI/CD

```bash
# In GitHub Actions
secrets:
  BASE_URL: ${{ secrets.TEST_BASE_URL }}
  TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
```

### Minimal Runtime Image

```dockerfile
FROM node:18-alpine
# Uses smaller base image (150 MB vs 400 MB)
# Includes only essential packages
```

## Useful Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias test-docker='docker-compose run --rm automation-tests npm run test'
alias test-docker-build='docker-compose up --build --abort-on-container-exit'
alias test-docker-clean='docker-compose down -v && docker image prune -a'
alias test-docker-logs='docker-compose logs -f automation-tests'

# Usage
test-docker              # Run tests
test-docker-build        # Build and run
test-docker-clean        # Clean up
test-docker-logs         # View logs
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/dockerfile_best-practices)
- [Playwright Docker Integration](https://playwright.dev/docs/docker)
