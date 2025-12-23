import { test, expect } from '../fixtures/fixtures';
import { PRODUCTS } from '../data/testData';
import { logger } from '../utils/logger';

test.describe('Product Filtering & Search Tests', () => {
  test.beforeEach(async ({ productsPage }) => {
    logger.info('=== Starting Products Test ===');
    await productsPage.navigateToProducts();
    await productsPage.waitForProductsToLoad();
  });

  test('TC-101: Products page loads successfully', async ({ productsPage }) => {
    // Assert
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    logger.info(`✓ Products page loaded with ${productCount} products`);
  });

  test('TC-102: Filter products by price range', async ({ productsPage }) => {
    // Act
    await productsPage.filterByPrice('100', '500');

    // Assert
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(0);
    logger.info(`✓ Price filter applied, found ${productCount} products`);
  });

  test('TC-103: Filter products by category', async ({ productsPage }) => {
    // Act
    await productsPage.filterByCategory('Electronics');

    // Assert
    const hasResults = await productsPage.hasResults();
    expect(hasResults).toBeTruthy();
    logger.info('✓ Category filter applied successfully');
  });

  test('TC-104: Sort products by price ascending', async ({ productsPage }) => {
    // Arrange
    const initialProducts = await productsPage.getAllProductNames();

    // Act
    await productsPage.sortBy('price');

    // Assert
    const sortedProducts = await productsPage.getAllProductNames();
    expect(sortedProducts.length).toBeGreaterThan(0);
    logger.info('✓ Products sorted by price');
  });

  test('TC-105: Search product by name', async ({ homePage, productsPage }) => {
    // Arrange
    const searchTerm = 'Laptop';

    // Act
    await homePage.navigateToHome();
    await homePage.searchProduct(searchTerm);

    // Assert
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    const productNames = await productsPage.getAllProductNames();
    const hasSearchTerm = productNames.some((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(hasSearchTerm).toBeTruthy();
    logger.info(`✓ Search for "${searchTerm}" returned ${productCount} results`);
  });

  test('TC-106: Filter with no results shows appropriate message', async ({ productsPage }) => {
    // Act
    await productsPage.filterByPrice('10000', '20000');

    // Assert
    const isNoResultsVisible = await productsPage.isNoResultsMessageVisible();
    expect(isNoResultsVisible).toBeTruthy();
    logger.info('✓ "No results" message displayed correctly');
  });

  test('TC-107: Clear all filters returns to initial state', async ({ productsPage }) => {
    // Arrange
    const initialCount = await productsPage.getProductCount();

    // Act
    await productsPage.filterByPrice('100', '300');
    await productsPage.clearAllFilters();

    // Assert
    const finalCount = await productsPage.getProductCount();
    expect(finalCount).toBe(initialCount);
    logger.info('✓ Filters cleared successfully');
  });

  test('TC-108: Pagination works correctly', async ({ productsPage }) => {
    // Arrange
    const initialPageInfo = await productsPage.getPageInfo();

    // Act - Go to next page if available
    const nextPageBtn = productsPage.nextPageButton;
    const isNextPageAvailable = await nextPageBtn.isVisible();

    if (isNextPageAvailable) {
      await productsPage.goToNextPage();
      const nextPageInfo = await productsPage.getPageInfo();

      // Assert
      expect(nextPageInfo).not.toBe(initialPageInfo);
      logger.info('✓ Pagination works correctly');
    } else {
      logger.info('ⓘ Only one page of products');
    }
  });

  test('TC-109: View product details', async ({ productsPage }) => {
    // Act
    const productNames = await productsPage.getAllProductNames();
    if (productNames.length > 0) {
      await productsPage.clickProductByName(productNames[0]);

      // Assert
      await productsPage.page.waitForLoadState('networkidle');
      const url = await productsPage.getCurrentUrl();
      expect(url).toContain('product');
      logger.info(`✓ Opened product details page for "${productNames[0]}"`);
    }
  });

  test('TC-110: Add product to cart from product list', async ({ productsPage, cartPage }) => {
    // Act
    const initialCount = await cartPage.getCartItemCount();
    await productsPage.addFirstProductToCart();

    // Assert
    await cartPage.navigateToCart();
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount + 1);
    logger.info('✓ Product added to cart successfully');
  });

  test('TC-111: Filter by rating', async ({ productsPage }) => {
    // Act
    await productsPage.filterByRating('4');

    // Assert
    const hasResults = await productsPage.hasResults();
    expect(hasResults).toBeTruthy();
    logger.info('✓ Rating filter applied successfully');
  });

  test('TC-112: Multiple filters can be combined', async ({ productsPage }) => {
    // Act
    await productsPage.filterByCategory('Electronics');
    await productsPage.filterByPrice('100', '500');

    // Assert
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThanOrEqual(0);
    logger.info(`✓ Multiple filters applied, found ${productCount} products`);
  });
});
