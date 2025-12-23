import { BasePage } from './basePage';
import { Page } from '@playwright/test';

/**
 * Products Page Object
 * Handling product catalog, filtering, and sorting operations
 */
export class ProductsPage extends BasePage {
  // Selectors for products
  readonly productItems = this.page.locator('[data-testid="product-item"], .product-card');
  readonly productName = this.page.locator('[data-testid="product-name"], .product-title');
  readonly productPrice = this.page.locator('[data-testid="product-price"], .price');
  readonly addToCartButtons = this.page.locator('[data-testid="add-to-cart"], button:has-text("Add to Cart")');

  // Selectors for filters
  readonly priceFilterMin = this.page.locator('[data-testid="price-min"], input[placeholder*="Min"]');
  readonly priceFilterMax = this.page.locator('[data-testid="price-max"], input[placeholder*="Max"]');
  readonly categoryFilter = this.page.locator('[data-testid="category-filter"], select');
  readonly ratingFilter = this.page.locator('[data-testid="rating-filter"], select');
  readonly applyFiltersButton = this.page.locator('[data-testid="apply-filters"], button:has-text("Apply")');
  readonly clearFiltersButton = this.page.locator('[data-testid="clear-filters"], button:has-text("Clear")');

  // Selectors for sorting
  readonly sortDropdown = this.page.locator('[data-testid="sort"], select');
  readonly sortByPrice = this.page.locator('option[value="price"]');
  readonly sortByRating = this.page.locator('option[value="rating"]');
  readonly sortByNewest = this.page.locator('option[value="newest"]');

  // Pagination
  readonly nextPageButton = this.page.locator('[data-testid="next-page"], button:has-text("Next")');
  readonly previousPageButton = this.page.locator('[data-testid="prev-page"], button:has-text("Previous")');
  readonly pageInfo = this.page.locator('[data-testid="page-info"]');

  // Other
  readonly noResultsMessage = this.page.locator('[data-testid="no-results"], text=No products found');
  readonly loadingSpinner = this.page.locator('[data-testid="loading"], .spinner');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to products page
   */
  async navigateToProducts(category?: string) {
    const path = category ? `/products?category=${category}` : '/products';
    await this.goto(path);
  }

  /**
   * Get number of products on page
   */
  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  /**
   * Get names of all products
   */
  async getAllProductNames(): Promise<string[]> {
    return this.productName.allTextContents();
  }

  /**
   * Get prices of all products
   */
  async getAllProductPrices(): Promise<string[]> {
    return this.productPrice.allTextContents();
  }

  /**
   * Find and click product by name
   */
  async clickProductByName(productName: string) {
    await this.page.locator(`[data-testid="product-item"]:has-text("${productName}")`).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add first product to cart
   */
  async addFirstProductToCart() {
    const firstAddButton = this.addToCartButtons.first();
    await firstAddButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add product to cart by name
   */
  async addProductToCart(productName: string) {
    await this.page
      .locator(`[data-testid="product-item"]:has-text("${productName}") [data-testid="add-to-cart"]`)
      .click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Set minimum price filter
   */
  async setMinPrice(minPrice: string) {
    await this.priceFilterMin.fill(minPrice);
  }

  /**
   * Set maximum price filter
   */
  async setMaxPrice(maxPrice: string) {
    await this.priceFilterMax.fill(maxPrice);
  }

  /**
   * Filter by price range
   */
  async filterByPrice(minPrice: string, maxPrice: string) {
    await this.setMinPrice(minPrice);
    await this.setMaxPrice(maxPrice);
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter by category
   */
  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Filter by rating
   */
  async filterByRating(rating: string) {
    await this.ratingFilter.selectOption(rating);
    await this.applyFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear all applied filters
   */
  async clearAllFilters() {
    await this.clearFiltersButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Sort products by specified option
   */
  async sortBy(sortOption: 'price' | 'rating' | 'newest') {
    await this.sortDropdown.selectOption(sortOption);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if search results exist
   */
  async hasResults(): Promise<boolean> {
    return (await this.getProductCount()) > 0;
  }

  /**
   * Check if no results message is visible
   */
  async isNoResultsMessageVisible(): Promise<boolean> {
    return this.noResultsMessage.isVisible().catch(() => false);
  }

  /**
   * Go to next page
   */
  async goToNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go to previous page
   */
  async goToPreviousPage() {
    await this.previousPageButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page information
   */
  async getPageInfo(): Promise<string> {
    return this.pageInfo.textContent() || '';
  }

  /**
   * Wait for products to load
   */
  async waitForProductsToLoad() {
    await this.loadingSpinner.waitFor({ state: 'hidden' }).catch(() => {});
    await this.productItems.first().waitFor({ state: 'visible' });
  }
}
