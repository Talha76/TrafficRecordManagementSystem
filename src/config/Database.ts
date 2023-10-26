import pg from 'pg';
const { Pool } = pg;
import { config } from 'dotenv';
config();

class Database {
  public pool;
  public static instance: Database | undefined;

  public constructor() {
    this.pool = new Pool({
      connectionString: process.env.POOL_URI
    });
  }

  public static getInstance(): Database {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

  public async query(query: string) {
    if (!this.pool)
      throw new Error('Database pool is not initialized');

    const client = await this.pool?.connect();
    const result = await client.query(query);
    await client.release();
    return result;
  }
}

export default Database;
