type Bucket = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, Bucket>();

export function checkRateLimit(input: {
  key: string;
  windowMs: number;
  max: number;
}): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const current = memoryStore.get(input.key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + input.windowMs;
    memoryStore.set(input.key, { count: 1, resetAt });
    return { allowed: true, remaining: input.max - 1, resetAt };
  }

  if (current.count >= input.max) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  memoryStore.set(input.key, current);
  return {
    allowed: true,
    remaining: input.max - current.count,
    resetAt: current.resetAt,
  };
}
