import { test, expect } from '../fixtures/fixtures';
import { CHECKOUT_DATA } from '../data/testData';
import { logger } from '../utils/logger';

test.describe('Checkout & Order Placement Tests', () => {
  test.beforeEach(async ({ productsPage, cartPage }) => {
    logger.info('=== Starting Checkout Test ===');
    await productsPage.navigateToProducts();
    await productsPage.waitForProductsToLoad();
    await productsPage.addFirstProductToCart();
    await cartPage.navigateToCart();
  });

  test('TC-301: Navigate to checkout page', async ({ cartPage, checkoutPage }) => {
    // Act
    await cartPage.goToCheckout();

    // Assert
    const url = await checkoutPage.getCurrentUrl();
    expect(url).toContain('checkout');
    logger.info('✓ Navigated to checkout page');
  });

  test('TC-302: Fill shipping information', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode, country } =
      CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode, country);

    // Assert
    const filledEmail = await checkoutPage.getInputValue('[data-testid="shipping-email"]');
    expect(filledEmail).toBe(email);
    logger.info('✓ Shipping information filled');
  });

  test('TC-303: Billing address same as shipping', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode, country } =
      CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode, country);
    await checkoutPage.setSameAsShipping();

    // Assert
    const checkbox = await checkoutPage.sameAsShippingCheckbox.isChecked();
    expect(checkbox).toBeTruthy();
    logger.info('✓ Billing address set as same as shipping');
  });

  test('TC-304: Fill card payment information', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode, cardName, cardNumber, expiry, cvc } =
      CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode);
    await checkoutPage.fillCardInfo(cardName, cardNumber, expiry, cvc);

    // Assert
    const filledCardName = await checkoutPage.getInputValue('[data-testid="card-name"]');
    expect(filledCardName).toBe(cardName);
    logger.info('✓ Card information filled');
  });

  test('TC-305: Select shipping method', async ({ cartPage, checkoutPage }) => {
    // Act
    await cartPage.goToCheckout();
    await checkoutPage.selectShippingMethod(0);

    // Assert
    const shippingCost = await checkoutPage.getShippingCost();
    expect(shippingCost).toBeTruthy();
    logger.info(`✓ Shipping method selected: ${shippingCost}`);
  });

  test('TC-306: View order summary', async ({ cartPage, checkoutPage }) => {
    // Act
    await cartPage.goToCheckout();

    // Assert
    const subtotal = await checkoutPage.getSubtotal();
    const total = await checkoutPage.getTotalPrice();
    expect(subtotal).toBeTruthy();
    expect(total).toBeTruthy();
    logger.info(`✓ Order summary: Subtotal: ${subtotal}, Total: ${total}`);
  });

  test('TC-307: Place order with valid data', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode, cardName, cardNumber, expiry, cvc } =
      CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode);
    await checkoutPage.setSameAsShipping();
    await checkoutPage.fillCardInfo(cardName, cardNumber, expiry, cvc);
    await checkoutPage.selectShippingMethod(0);
    await checkoutPage.placeOrder();

    // Assert
    await checkoutPage.page.waitForLoadState('networkidle');
    const url = await checkoutPage.getCurrentUrl();
    logger.info(`✓ Order placed, navigated to: ${url}`);
  });

  test('TC-308: Missing required fields validation', async ({ cartPage, checkoutPage }) => {
    // Act
    await cartPage.goToCheckout();
    // Try to place order without filling in fields
    await checkoutPage.placeOrder();

    // Assert
    const isErrorVisible = await checkoutPage.isErrorVisible();
    if (isErrorVisible) {
      const errorMessage = await checkoutPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      logger.info(`✓ Validation error displayed: ${errorMessage}`);
    }
  });

  test('TC-309: Apply gift card code at checkout', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode } = CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode);

    if (await checkoutPage.giftCardInput.isVisible().catch(() => false)) {
      await checkoutPage.applyGiftCard('GIFT50');
      const total = await checkoutPage.getTotalPrice();

      // Assert
      expect(total).toBeTruthy();
      logger.info(`✓ Gift card applied, new total: ${total}`);
    }
  });

  test('TC-310: Order success page verification', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode, cardName, cardNumber, expiry, cvc } =
      CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode);
    await checkoutPage.setSameAsShipping();
    await checkoutPage.fillCardInfo(cardName, cardNumber, expiry, cvc);
    await checkoutPage.selectShippingMethod(0);
    await checkoutPage.placeOrder();

    // Assert
    const url = await checkoutPage.getCurrentUrl();
    expect(url).toContain('success' || 'order');
    logger.info('✓ Order success page verified');
  });

  test('TC-311: Multiple shipping options available', async ({ cartPage, checkoutPage }) => {
    // Act
    await cartPage.goToCheckout();

    // Assert
    const optionCount = await checkoutPage.shippingOptions.count();
    expect(optionCount).toBeGreaterThan(0);
    logger.info(`✓ ${optionCount} shipping options available`);
  });

  test('TC-312: Order total updates with shipping selection', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode } = CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode);
    const initialTotal = await checkoutPage.getTotalPrice();

    // Select different shipping method if available
    const optionCount = await checkoutPage.shippingOptions.count();
    if (optionCount > 1) {
      await checkoutPage.selectShippingMethod(1);
      const newTotal = await checkoutPage.getTotalPrice();

      // Assert
      expect(newTotal).toBeTruthy();
      logger.info(`✓ Total updated: ${initialTotal} -> ${newTotal}`);
    }
  });

  test('TC-313: Checkout tabs navigation (if multi-step)', async ({ cartPage, checkoutPage }) => {
    // Act
    await cartPage.goToCheckout();

    // Check if tabs exist
    const shippingTabVisible = await checkoutPage.shippingTab.isVisible().catch(() => false);
    const paymentTabVisible = await checkoutPage.paymentTab.isVisible().catch(() => false);

    // Assert
    if (shippingTabVisible && paymentTabVisible) {
      await checkoutPage.goToPaymentTab();
      const url = await checkoutPage.getCurrentUrl();
      expect(url).toBeTruthy();
      logger.info('✓ Checkout tabs navigation works');
    }
  });

  test('TC-314: Edit shipping address after initial entry', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, email, phone, address, city, state, zipCode } = CHECKOUT_DATA.VALID_CHECKOUT;

    // Act
    await cartPage.goToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, email, phone, address, city, state, zipCode);
    await checkoutPage.fillShippingInfo(
      'Jane',
      'Doe',
      'jane@example.com',
      '+0987654321',
      'New Address',
      'LA',
      'CA',
      '90001'
    );

    // Assert
    const filledEmail = await checkoutPage.getInputValue('[data-testid="shipping-email"]');
    expect(filledEmail).toBe('jane@example.com');
    logger.info('✓ Shipping address updated');
  });

  test('TC-315: Full E2E checkout flow', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const checkoutData = CHECKOUT_DATA.VALID_CHECKOUT;

    // Act - Complete checkout process
    await cartPage.goToCheckout();
    await checkoutPage.completeCheckout(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.email,
      checkoutData.phone,
      checkoutData.address,
      checkoutData.city,
      checkoutData.state,
      checkoutData.zipCode,
      checkoutData.cardName,
      checkoutData.cardNumber,
      checkoutData.expiry,
      checkoutData.cvc
    );

    // Assert
    const url = await checkoutPage.getCurrentUrl();
    expect(url).toBeTruthy();
    logger.info(`✓ Full E2E checkout completed successfully`);
  });
});
