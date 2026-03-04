export async function withRetries<T>(
  operation: () => Promise<T>,
  attempts = 3,
  baseDelayMs = 200
): Promise<T> {
  let lastError: unknown;

  for (let index = 0; index < attempts; index += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (index === attempts - 1) break;
      const delay = baseDelayMs * (index + 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Operation failed after retries');
}
