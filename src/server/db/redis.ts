import { env } from "@/env/server.mjs";
import Redis from "ioredis";

const redis = new Redis(env.REDIS_URL);

export default redis;
