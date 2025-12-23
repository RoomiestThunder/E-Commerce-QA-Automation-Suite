import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * Base page class for all Page Objects.
 * Contains common methods and utilities.
 */
export class BasePage {
  protected page: Page;
  protected baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://example-ecommerce.com';
  }

  /**
   * Navigate to a specific page path
   */
  async goto(path: string = '/') {
    logger.info(`Navigating to: ${this.baseURL}${path}`);
    await this.page.goto(`${this.baseURL}${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Take a screenshot of the page
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(callback: () => Promise<void>) {
    const navigationPromise = this.page.waitForNavigation();
    await callback();
    await navigationPromise;
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(selector: string, timeout: number = 5000) {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click on element
   */
  async click(selector: string) {
    logger.info(`Clicking on: ${selector}`);
    await this.page.locator(selector).click();
  }

  /**
   * Fill text input field
   */
  async fill(selector: string, value: string) {
    logger.info(`Filling ${selector} with: ${value}`);
    await this.page.locator(selector).fill(value);
  }

  /**
   * Get text content from element
   */
  async getText(selector: string): Promise<string> {
    return (await this.page.locator(selector).textContent()) || '';
  }

  /**
   * Get attribute value from element
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    return this.page.locator(selector).getAttribute(attribute);
  }

  /**
   * Check if element has specific CSS class
   */
  async hasClass(selector: string, className: string): Promise<boolean> {
    const classAttribute = await this.getAttribute(selector, 'class');
    return classAttribute?.includes(className) || false;
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string) {
    logger.info(`Selecting option ${value} in ${selector}`);
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Get input field value
   */
  async getInputValue(selector: string): Promise<string> {
    return (await this.page.locator(selector).inputValue()) || '';
  }

  /**
   * Check if page contains specific text
   */
  async pageContainsText(text: string): Promise<boolean> {
    return this.page.getByText(text).isVisible().catch(() => false);
  }

  /**
   * Scroll to element into view
   */
  async scrollToElement(selector: string) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string) {
    await this.page.keyboard.press(key);
  }

  /**
   * Close the page
   */
  async close() {
    await this.page.close();
  }
}
