import { Client } from "pg";

import config from "./config";

export function getClient(): Client {
  const client = new Client({
    connectionString: config.DATABASE_URL,
  });

  return client;
}
