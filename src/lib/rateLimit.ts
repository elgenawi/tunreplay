import { headers } from 'next/headers';

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]>;
  private maxRequests: number;
  private windowMs: number;

  constructor({ maxRequests, windowMs }: RateLimiterOptions) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Remove timestamps outside the window
    const validTimestamps = timestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (validTimestamps.length >= this.maxRequests) {
      return false;
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    return true;
  }

  getRemainingTime(key: string): number {
    const timestamps = this.requests.get(key) || [];
    if (timestamps.length === 0) return 0;

    const now = Date.now();
    const oldestTimestamp = timestamps[0];
    return Math.max(0, this.windowMs - (now - oldestTimestamp));
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter({
  maxRequests: 20,
  windowMs: 60 * 1000, // 1 minute
});

export function checkRateLimit() {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const isAllowed = rateLimiter.check(ip);
  
  if (!isAllowed) {
    const remainingTime = Math.ceil(rateLimiter.getRemainingTime(ip) / 1000);
    throw new Error(`Too many requests. Please try again in ${remainingTime} seconds.`);
  }
} 