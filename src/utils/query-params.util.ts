import type { z } from 'zod';

/**
 * Parse query parameters from URLSearchParams using a Zod schema
 */
export function parseQueryParams<T extends z.ZodTypeAny>(
  searchParams: URLSearchParams,
  schema: T
): z.infer<T> {
  const params = Object.fromEntries(searchParams.entries());
  return schema.parse(params);
}
