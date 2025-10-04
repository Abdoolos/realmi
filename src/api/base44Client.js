// This file has been replaced with localClient.js
// Base44 SDK authentication has been removed
// All functionality now works locally without external authentication

import { localClient } from './localClient';

// Export local client for backward compatibility
export const base44 = localClient;

// Legacy exports for any remaining references
export { localClient as createClient };
