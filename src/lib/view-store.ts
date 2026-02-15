const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const hasRedisConfig = Boolean(redisUrl && redisToken);

function keyForSlug(slug: string) {
  return `whyujjwal:views:${slug}`;
}

function parseViews(result: unknown) {
  const num = Number(result);
  if (!Number.isFinite(num) || num < 0) {
    return 0;
  }
  return Math.floor(num);
}

async function redisCall(path: string, method: "GET" | "POST" = "GET") {
  if (!redisUrl || !redisToken) {
    return null;
  }

  const response = await fetch(`${redisUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${redisToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { result?: unknown };
  return data.result;
}

export function isViewStoreEnabled() {
  return hasRedisConfig;
}

export async function getViews(slug: string) {
  if (!hasRedisConfig) {
    return null;
  }

  const key = keyForSlug(slug);
  const result = await redisCall(`/get/${encodeURIComponent(key)}`);
  return parseViews(result ?? 0);
}

export async function incrementViews(slug: string) {
  if (!hasRedisConfig) {
    return null;
  }

  const key = keyForSlug(slug);
  const encodedKey = encodeURIComponent(key);
  const result = await redisCall(`/incr/${encodedKey}`, "POST");
  await redisCall(`/expire/${encodedKey}/31536000`, "POST");
  return parseViews(result ?? 0);
}
