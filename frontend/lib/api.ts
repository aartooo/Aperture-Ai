// FILE: frontend/lib/api.ts
import qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_URL) {
  throw new Error("NEXT_PUBLIC_STRAPI_URL is not defined in .env");
}

// Use shorter cache in development, longer in production
const isDev = process.env.NODE_ENV === 'development';
const CACHE_REVALIDATE = isDev ? 10 : 3600; // 10 seconds in dev, 1 hour in prod

/**
 * Fetches data from the Strapi API
 * @param endpoint - The API endpoint to fetch (e.g., "categories")
 * @param query - Optional query parameters
 * @param options - Optional fetch options
 * @returns The JSON response from the API, typed as <T>
 */
export async function fetchApi<T>(
  endpoint: string,
  query: Record<string, unknown> = {},
  options: RequestInit = {}
): Promise<T> {
  // 1. Merge default options with authentication
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(STRAPI_API_TOKEN ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` } : {}),
    },
    next: { revalidate: CACHE_REVALIDATE },
    ...options,
  };

  // 2. Build the query string
  const queryString = qs.stringify(query, {
    encodeValuesOnly: true,
    arrayFormat: "brackets",
  });
  const requestUrl = `${STRAPI_URL}/api/${endpoint}${queryString ? `?${queryString}` : ""}`;

  // 3. Make the API call
  try {
    const response = await fetch(requestUrl, defaultOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `[Strapi API] HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }
    const data = await response.json();
    if (!data.data) {
      console.warn(`[Strapi API] No data returned for ${requestUrl}`);
    }
    return data as T;
  } catch (error) {
    console.error(`[Strapi API] Error fetching ${requestUrl}:`, error);
    throw error;
  }
}