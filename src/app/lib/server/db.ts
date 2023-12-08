import { Client, QueryResult } from "pg";

import config from "./config";

export function getClient(): Client {
  let sslmode = "";

  console.log(config.ENV);
  if (config.ENV === "production") {
    sslmode = "?sslmode=require";
  }

  const client = new Client({
    connectionString: config.DATABASE_URL + sslmode,
  });

  return client;
}

export async function sql(
  sql: string,
  values?: any[]
): Promise<QueryResult<any>> {
  const client = getClient();

  await client.connect();
  const res = await client.query(sql, values);

  await client.end();

  return res;
}
