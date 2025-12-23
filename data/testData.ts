/**
 * Test users for automated testing
 */

export const TEST_USERS = {
  VALID_USER: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
  },
  NEW_USER: {
    email: `newuser_${Date.now()}@example.com`,
    password: 'NewPassword123!',
    firstName: 'New',
    lastName: 'Customer',
  },
  INVALID_EMAIL: {
    email: 'invalid-email@example.com',
    password: 'TestPassword123!',
  },
  INVALID_PASSWORD: {
    email: 'test@example.com',
    password: 'WrongPassword123!',
  },
  NONEXISTENT_USER: {
    email: 'nonexistent@example.com',
    password: 'SomePassword123!',
  },
};

export const CHECKOUT_DATA = {
  VALID_CHECKOUT: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US',
    cardName: 'John Doe',
    cardNumber: '4532015112830366',
    expiry: '12/25',
    cvc: '123',
  },
  INVALID_CARD: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    country: 'US',
    cardName: 'Jane Smith',
    cardNumber: '1234567890123456',
    expiry: '01/25',
    cvc: '000',
  },
};

export const PROMO_CODES = {
  VALID_COUPON: 'SAVE10',
  EXPIRED_COUPON: 'EXPIRED',
  INVALID_COUPON: 'INVALID123',
  GIFT_CARD: 'GIFT50',
};

export const PRODUCTS = {
  LAPTOP: {
    name: 'Laptop Pro',
    price: '999.99',
    category: 'Electronics',
  },
  PHONE: {
    name: 'Smartphone X',
    price: '799.99',
    category: 'Electronics',
  },
  HEADPHONES: {
    name: 'Wireless Headphones',
    price: '199.99',
    category: 'Audio',
  },
  CHARGER: {
    name: 'USB-C Charger',
    price: '29.99',
    category: 'Accessories',
  },
};
