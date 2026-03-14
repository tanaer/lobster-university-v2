import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __redis: Redis | undefined;
}

function createRedis() {
  return new Redis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      return Math.min(times * 200, 3000);
    },
  });
}

// globalThis 缓存防 HMR 重复创建连接
export const redis: Redis =
  globalThis.__redis ?? (globalThis.__redis = createRedis());
