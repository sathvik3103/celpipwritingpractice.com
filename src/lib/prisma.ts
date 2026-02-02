import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Execute a database operation with automatic retry logic.
 * This handles Railway database cold starts where the first connection
 * may fail while the database is waking up from sleep.
 * 
 * @param operation - The database operation to execute
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if it's a connection-related error worth retrying
      const isConnectionError = 
        lastError.message.includes("Connection") ||
        lastError.message.includes("connection") ||
        lastError.message.includes("ECONNREFUSED") ||
        lastError.message.includes("ETIMEDOUT") ||
        lastError.message.includes("Can't reach database server") ||
        lastError.message.includes("Connection timed out");
      
      if (!isConnectionError || attempt === maxRetries) {
        throw lastError;
      }
      
      console.log(`Database connection attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      // Exponential backoff: double the delay for next retry
      delayMs *= 2;
    }
  }
  
  throw lastError;
}
