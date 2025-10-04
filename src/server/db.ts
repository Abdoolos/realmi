import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
declare global {
  var __prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

export { prisma };

// Helper to disconnect
export async function disconnectDB() {
  await prisma.$disconnect();
}

// Helper to connect and test connection
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    return false;
  }
}

// Transaction helper
export async function withTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(callback);
}

export default prisma;
