import { localClient } from './localClient';

// Export all functions from local client
export const stripeWebhook = localClient.functions.stripeWebhook;

export const stripeUtils = localClient.functions.stripeUtils;

export const stripeHandlers = localClient.functions.stripeHandlers;

export const getStripeEventStatus = localClient.functions.getStripeEventStatus;

export const validateDiscountCode = localClient.functions.validateDiscountCode;

export const createStripeCheckout = localClient.functions.createStripeCheckout;

export const createBillingPortalSession = localClient.functions.createBillingPortalSession;

export const getFamilyData = localClient.functions.getFamilyData;

export const getCurrencyRates = localClient.functions.getCurrencyRates;
