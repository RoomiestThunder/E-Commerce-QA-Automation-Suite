/**
 * Test users for automated testing
 * Based on SauceDemo test accounts: https://www.saucedemo.com/
 */

export const TEST_USERS = {
  VALID_USER: {
    email: 'standard_user',
    password: 'secret_sauce',
    firstName: 'Standard',
    lastName: 'User',
  },
  NEW_USER: {
    email: 'performance_glitch_user',
    password: 'secret_sauce',
    firstName: 'Performance',
    lastName: 'User',
  },
  INVALID_EMAIL: {
    email: 'invalid_user',
    password: 'secret_sauce',
  },
  INVALID_PASSWORD: {
    email: 'standard_user',
    password: 'wrong_password',
  },
  NONEXISTENT_USER: {
    email: 'locked_out_user',
    password: 'secret_sauce',
  },
  PROBLEM_USER: {
    email: 'problem_user',
    password: 'secret_sauce',
    firstName: 'Problem',
    lastName: 'User',
  },
};

export const CHECKOUT_DATA = {
  VALID_CHECKOUT: {
    firstName: 'John',
    lastName: 'Doe',
    zipCode: '10001',
  },
  INVALID_CHECKOUT: {
    firstName: '',
    lastName: '',
    zipCode: '',
  },
};

export const PROMO_CODES = {
  VALID_COUPON: 'SAVE10',
  EXPIRED_COUPON: 'EXPIRED',
  INVALID_COUPON: 'INVALID123',
  GIFT_CARD: 'GIFT50',
};

export const PRODUCTS = {
  BACKPACK: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
    category: 'Accessories',
  },
  BIKE_LIGHT: {
    name: 'Sauce Labs Bike Light',
    price: '$9.99',
    category: 'Accessories',
  },
  BOLT_TSHIRT: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    category: 'Clothing',
  },
  FLEECE_JACKET: {
    name: 'Sauce Labs Fleece Jacket',
    price: '$49.99',
    category: 'Clothing',
  },
};
