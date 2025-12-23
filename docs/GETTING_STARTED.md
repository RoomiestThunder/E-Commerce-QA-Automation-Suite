# Getting Started Guide

Complete installation and usage guide for the automation testing suite.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Tests](#running-tests)
5. [Viewing Reports](#viewing-reports)
6. [Debugging](#debugging)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js: 18.0 or higher
- npm: 8.0 or higher
- macOS, Linux, or Windows with internet access
- Git for version control

## Installation

### Step 1: Install Dependencies

Clone and enter the project directory:

```bash
cd /path/to/automation-suite
npm install
```

This will install:
- Playwright test framework
- TypeScript compiler
- ESLint for code linting
- Prettier for code formatting
- All other required dependencies

### Step 2: Install Playwright Browsers

Install browser binaries required for testing:

```bash
# Install all browsers (Chromium, Firefox, WebKit)
npx playwright install --with-deps

# Or install specific browser
npx playwright install chromium
```

The `--with-deps` flag installs system dependencies required for browsers to run.

### Step 3: Set Environment Variables

Create environment configuration file:

```bash
# Copy example configuration
cp .env.example .env

# Edit .env with your settings (see Configuration section below)
```

Minimum required variables:
- `BASE_URL`: Your e-commerce application URL
- `TEST_USERNAME`: Email of test user account
- `TEST_PASSWORD`: Password of test user account

### Step 4: Verify Installation

Run authentication tests to verify setup:

```bash
npm run test:auth
```

If tests pass, your environment is properly configured.

## Configuration

### Environment Variables

Edit `.env` file with required settings:

```env
# Target application URL
BASE_URL=https://your-ecommerce-site.com

# Test user credentials
TEST_USERNAME=testuser@example.com
TEST_PASSWORD=SecurePassword123

# Browser execution mode
HEADLESS=true  # Set to false for visible browser

# Logging level
LOG_LEVEL=info  # Options: debug, info, warn, error

# Test timeout in milliseconds
TIMEOUT=30000

# Optional: Proxy configuration
# PROXY_URL=http://proxy.example.com:8080
```

### Playwright Configuration

Key settings in `playwright.config.ts`:

```typescript
export const config: PlaywrightTestConfig = {
  // Target URL for all tests
  use: { baseURL: process.env.BASE_URL },
  
  // Browser configuration
  webServer: {
    command: 'npm run dev',
    url: process.env.BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
  
  // Test execution settings
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  
  // Parallelization
  workers: process.env.CI ? 1 : 4,
  
  // Retry configuration
  retries: process.env.CI ? 2 : 0,
  
  // Test reporting
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    ['junit', { outputFile: 'test-results.xml' }],
  ],
};
```

### TypeScript Configuration

The project uses TypeScript strict mode with path aliases:

```json
{
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["pages/*"],
      "@tests/*": ["tests/*"],
      "@fixtures/*": ["fixtures/*"],
      "@utils/*": ["utils/*"],
      "@data/*": ["data/*"]
    }
  }
}
```

This allows clean imports:

```typescript
// Instead of: import { LoginPage } from '../../../pages/loginPage';
// Use: import { LoginPage } from '@pages/loginPage';
```

## Running Tests

### All Tests

Execute complete test suite:

```bash
npm run test
```

This runs all 50+ tests across all modules.

### By Module

Run tests for specific functionality:

```bash
# Authentication tests (8 tests)
npm run test:auth

# Product catalog tests (12 tests)
npm run test:products

# Shopping cart tests (15 tests)
npm run test:cart

# Checkout flow tests (15 tests)
npm run test:checkout
```

### Browser-Specific Tests

Test against specific browsers:

```bash
# Chromium only
npm run test:chrome

# Firefox only
npm run test:firefox

# WebKit only
npm run test:webkit
```

### Execution Modes

Run tests with different execution options:

```bash
# Show browser during test execution
npm run test:headed

# Interactive UI mode (recommended for debugging)
npm run test:ui

# Step-by-step debugger
npm run test:debug

# Record execution trace
npm run test -- --trace on
```

### Advanced Options

Fine-tune test execution:

```bash
# Run specific test file
npm run test -- tests/auth.spec.ts

# Run tests matching pattern
npm run test -- --grep "login"

# Run single test by name
npm run test -- --grep "^Valid credentials should authenticate user$"

# Custom timeout for tests
npm run test -- --timeout 60000

# Parallel worker count
npm run test -- --workers 2

# Verbosity
npm run test -- --verbose
```

## Viewing Reports

### HTML Report

View comprehensive test results with screenshots:

```bash
npm run test:report
```

This opens interactive HTML report showing:
- Test execution timeline
- Pass/fail status
- Screenshots on failure
- Video recordings (if configured)
- Execution trace information

### JSON Report

Export results for CI/CD integration:

```bash
npm run test -- --reporter=json > test-results.json
```

Results include:
- Test status and duration
- Error messages
- Attachment metadata

### JUnit XML Report

Generate CI/CD compatible reports:

```bash
npm run test -- --reporter=junit
```

Useful for Jenkins, GitLab CI, and other platforms.

## Debugging

### UI Mode (Recommended)

Interactive step-by-step debugging:

```bash
npm run test:ui
```

Features:
- Step through test execution
- Inspect DOM at any step
- View network requests
- Take snapshots
- Modify test data on the fly

### Debug Mode with Inspector

Run with Playwright Inspector:

```bash
npm run test:debug
```

Inspector provides:
- Line-by-line debugging
- Console access
- Network monitoring
- Performance profiling

### Headed Mode

Run tests with visible browser:

```bash
npm run test:headed
```

Allows observation of:
- UI interactions
- Page navigation
- Error conditions
- Visual regression issues

### Logging

View structured test logs:

```bash
# Increase log verbosity
LOG_LEVEL=debug npm run test:auth

# View logs for specific test
npm run test -- tests/auth.spec.ts --verbose
```

Logger outputs:
- Test step execution
- Network requests/responses
- Error details
- Performance metrics

### Screenshots and Videos

Inspect captured media:

```bash
# Screenshots captured in test-results/
ls test-results/**/
```

Configure capture in `playwright.config.ts`:

```typescript
{
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  }
}
```

## Best Practices

### Test Structure

Follow Arrange-Act-Assert pattern:

```typescript
test('Should add item to cart', async ({ page, cartPage, productsPage }) => {
  // ARRANGE: Navigate to products
  await productsPage.navigateToProducts();
  
  // ACT: Add item to cart
  const product = await productsPage.getFirstProduct();
  await product.click();
  await page.click('button:has-text("Add to Cart")');
  
  // ASSERT: Verify item in cart
  const cartCount = await cartPage.getItemCount();
  expect(cartCount).toBe(1);
});
```

### Element Selection

Use stable, maintainable selectors:

```typescript
// Avoid: Brittle selectors
.click('div > div:nth-child(2) > button');

// Use: Explicit, semantic selectors
.locator('[data-testid="add-to-cart-button"]').click();
```

### Wait Strategies

Prefer explicit waits over delays:

```typescript
// Avoid: Hard waits
await page.waitForTimeout(1000);

// Use: Explicit conditions
await page.waitForLoadState('networkidle');
await page.locator('[data-testid="success-message"]').isVisible();
```

### Page Object Methods

Encapsulate interactions in page objects:

```typescript
// Avoid: Direct element interaction in tests
await page.fill('[data-testid="email"]', 'user@example.com');
await page.fill('[data-testid="password"]', 'password');
await page.click('button[type="submit"]');

// Use: Page object methods
await loginPage.login('user@example.com', 'password');
```

### Test Independence

Ensure tests don't depend on execution order:

```typescript
// Avoid: Tests relying on other tests
test('Login', async ({ loginPage }) => {
  await loginPage.login(credentials);
  // Uses global state
});

// Use: Self-contained tests with fixtures
test('Login', async ({ loginPage, authenticatedPage }) => {
  // Starts with clean state
  await loginPage.login(credentials);
  // Cleans up after
});
```

## Troubleshooting

### Browser Installation Fails

Error: "Chromium downloads as .zip for Windows..."

Solution:

```bash
# Reinstall with system dependencies
npx playwright install --with-deps chromium

# Or reinstall everything
npx playwright install-deps
```

### Port Already in Use

Error: "Port 3000 already in use"

Solution:

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run test
```

### Test Timeout Errors

Error: "Timeout 30000ms exceeded"

Solutions:

1. Increase timeout in `.env`:
```env
TIMEOUT=60000
```

2. Use explicit wait:
```typescript
await page.waitForLoadState('networkidle', { timeout: 60000 });
```

3. Check for network issues:
```typescript
LOG_LEVEL=debug npm run test
```

### Memory Issues

Error: "JavaScript heap out of memory"

Solutions:

```bash
# Reduce parallel workers
npm run test -- --workers 2

# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run test
```

### Playwright Version Mismatch

Error: "Browser binary version mismatch"

Solution:

```bash
# Clean and reinstall browsers
rm -rf ~/.cache/ms-playwright
npx playwright install
```

### Element Not Found

Error: "locator.click: Target page, context or browser has been closed"

Solutions:

1. Check selector exists:
```typescript
await expect(page.locator('[data-testid="button"]')).toBeVisible();
```

2. Wait for element:
```typescript
await page.locator('[data-testid="button"]').waitFor();
```

3. Use iframe if needed:
```typescript
const frameLocator = page.frameLocator('iframe[name="payment"]');
await frameLocator.locator('[data-testid="button"]').click();
```

### CI/CD Failures

Debugging failed tests in GitHub Actions:

1. Check workflow logs in Actions tab
2. Download artifacts (screenshots, videos, traces)
3. Review test output for environment-specific issues
4. Check base URL and credentials in repository secrets

### Connection Refused

Error: "Connection refused" when reaching target URL

Solutions:

1. Verify BASE_URL in `.env`:
```bash
curl https://your-ecommerce-site.com
```

2. Check firewall/proxy settings
3. Verify VPN connection if required
4. Test with hardcoded URL:
```typescript
await page.goto('https://your-site.com', { waitUntil: 'networkidle' });
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Inspector Guide](https://playwright.dev/docs/debug)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/actions)

## Getting Help

For issues or questions:

1. Check troubleshooting section above
2. Review test output logs with `LOG_LEVEL=debug`
3. Use Playwright Inspector: `npm run test:debug`
4. Check GitHub Discussions or Issues
5. Review Playwright documentation: https://playwright.dev
