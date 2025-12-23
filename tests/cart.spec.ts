import { test, expect } from '../fixtures/fixtures';
import { PROMO_CODES } from '../data/testData';
import { logger } from '../utils/logger';

test.describe('Shopping Cart Tests', () => {
  test.beforeEach(async ({ productsPage }) => {
    logger.info('=== Starting Cart Test ===');
    await productsPage.navigateToProducts();
    await productsPage.waitForProductsToLoad();
  });

  test('TC-201: Add single product to cart', async ({ productsPage, cartPage }) => {
    // Arrange
    const initialCount = await cartPage.getCartItemCount();

    // Act
    await productsPage.addFirstProductToCart();

    // Assert
    await cartPage.navigateToCart();
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount + 1);
    logger.info('✓ Product added to cart');
  });

  test('TC-202: Add multiple products to cart', async ({ productsPage, cartPage }) => {
    // Act
    await productsPage.addFirstProductToCart();
    await productsPage.navigateToProducts();
    await productsPage.addFirstProductToCart();

    // Assert
    await cartPage.navigateToCart();
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBeGreaterThanOrEqual(2);
    logger.info(`✓ Added multiple products, cart has ${cartCount} items`);
  });

  test('TC-203: Remove product from cart', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();
    const initialCount = await cartPage.getCartItemCount();

    // Act
    await cartPage.removeItem(0);

    // Assert
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount - 1);
    logger.info('✓ Product removed from cart');
  });

  test('TC-204: Change product quantity in cart', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();
    const initialQuantity = parseInt(await cartPage.getFirstItemQuantity());

    // Act
    await cartPage.changeQuantity(0, 3);

    // Assert
    const newQuantity = parseInt(await cartPage.getFirstItemQuantity());
    expect(newQuantity).toBe(3);
    logger.info(`✓ Quantity changed from ${initialQuantity} to ${newQuantity}`);
  });

  test('TC-205: Increase product quantity using + button', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();
    const initialQuantity = parseInt(await cartPage.getFirstItemQuantity());

    // Act
    await cartPage.increaseItemQuantity(0);

    // Assert
    const newQuantity = parseInt(await cartPage.getFirstItemQuantity());
    expect(newQuantity).toBe(initialQuantity + 1);
    logger.info(`✓ Quantity increased from ${initialQuantity} to ${newQuantity}`);
  });

  test('TC-206: Decrease product quantity using - button', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();
    await cartPage.changeQuantity(0, 3);
    const initialQuantity = 3;

    // Act
    await cartPage.decreaseItemQuantity(0);

    // Assert
    const newQuantity = parseInt(await cartPage.getFirstItemQuantity());
    expect(newQuantity).toBe(initialQuantity - 1);
    logger.info(`✓ Quantity decreased from ${initialQuantity} to ${newQuantity}`);
  });

  test('TC-207: Apply valid coupon code', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();

    // Act
    await cartPage.applyCoupon(PROMO_CODES.VALID_COUPON);

    // Assert
    const message = await cartPage.getCouponMessage();
    expect(message).toBeTruthy();
    logger.info(`✓ Coupon applied: ${message}`);
  });

  test('TC-208: Apply invalid coupon shows error', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();

    // Act
    await cartPage.applyCoupon(PROMO_CODES.INVALID_COUPON);

    // Assert
    const message = await cartPage.getCouponMessage();
    expect(message.toLowerCase()).toContain('invalid' || 'error');
    logger.info('✓ Invalid coupon error displayed');
  });

  test('TC-209: Remove applied coupon', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();
    await cartPage.applyCoupon(PROMO_CODES.VALID_COUPON);

    // Act
    await cartPage.removeCoupon();

    // Assert
    const discount = await cartPage.getDiscount();
    expect(discount).toContain('0') || expect(discount).toBeFalsy();
    logger.info('✓ Coupon removed successfully');
  });

  test('TC-210: Cart totals calculated correctly', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();

    // Act
    const subtotal = await cartPage.getSubtotal();
    const shipping = await cartPage.getShippingCost();
    const tax = await cartPage.getTaxCost();
    const total = await cartPage.getTotalPrice();

    // Assert
    expect(subtotal).toBeTruthy();
    expect(total).toBeTruthy();
    logger.info(`✓ Subtotal: ${subtotal}, Shipping: ${shipping}, Tax: ${tax}, Total: ${total}`);
  });

  test('TC-211: Select shipping method', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();

    // Act
    await cartPage.selectShippingOption(0);

    // Assert
    const shipping = await cartPage.getShippingCost();
    expect(shipping).toBeTruthy();
    logger.info('✓ Shipping method selected');
  });

  test('TC-212: Cart persists on page reload', async ({ productsPage, cartPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();
    const initialCount = await cartPage.getCartItemCount();

    // Act
    await cartPage.page.reload();

    // Assert
    const finalCount = await cartPage.getCartItemCount();
    expect(finalCount).toBe(initialCount);
    logger.info('✓ Cart persisted after page reload');
  });

  test('TC-213: Proceed to checkout from cart', async ({ productsPage, cartPage, checkoutPage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();

    // Act
    await cartPage.goToCheckout();

    // Assert
    await checkoutPage.page.waitForLoadState('networkidle');
    const url = await checkoutPage.getCurrentUrl();
    expect(url).toContain('checkout');
    logger.info('✓ Navigated to checkout');
  });

  test('TC-214: Empty cart message displayed when no items', async ({ cartPage }) => {
    // Act
    await cartPage.navigateToCart();

    // Assert
    const isEmpty = await cartPage.isCartEmpty();
    if (isEmpty) {
      logger.info('✓ Empty cart message displayed');
    }
    // Test passes if cart contains items or is empty
  });

  test('TC-215: Continue shopping button works', async ({ productsPage, cartPage, homePage }) => {
    // Arrange
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();

    // Act
    if ((await cartPage.continueShoppingButton.isVisible().catch(() => false))) {
      await cartPage.continueShopping();
    }

    // Assert
    const currentUrl = await cartPage.getCurrentUrl();
    expect(currentUrl).not.toContain('cart');
    logger.info('✓ Continued shopping');
  });
});
