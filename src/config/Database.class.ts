import pg from 'pg';
const { Pool } = pg;
import { config } from 'dotenv';
config();

/**
 * @class Database
 * @classdesc Utility class for database connection
 * @method getInstance - Returns the singleton instance of Database
 * @method query - Executes a query on the database
 * @throws {Error} - Throws an error if the database pool is not initialized
 * @throws {Error} - Throws an error if the database instance is not initialized
 * @example
 * const db = Database.getInstance();
 * const sql = `SELECT * FROM "users"`;
 * const result = await db.query(sql);
 * console.log(result);
 * @since 1.0.0
 * @version 1.0.0
 * @see https://node-postgres.com/api/pool
 * @see https://node-postgres.com/api/result
 */
class Database {
    /**
     * @member {Pool} pool - The database pool
     * @private
     */
  private readonly pool;
    /**
     * @member {Database} instance - The singleton instance of Database
     * @private
     */
  private static instance: Database | undefined;

  private constructor() {
    try {
      this.pool = new Pool({
        connectionString: process.env.POOL_URI
      });
    } catch(err) {
      throw err;
    }
  }

    /**
     * @method getInstance - Returns the singleton instance of Database
     * @returns {Database} - The singleton instance of Database
     * @since 1.0.0
     * @version 1.0.0
     * @example
     * const db = Database.getInstance();
     */
  static getInstance(): Database{
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }

    /**
     * @method query - Executes a query on the database
     * @param sql {string} - The SQL query to execute
     * @returns {Promise<pg.QueryResultRow[]>} - The result of the query
     * @throws {Error} - Throws an error if the database pool is not initialized
     * @throws {Error} - Throws an error if the database instance is not initialized
     * @since 1.0.0
     * @version 1.0.0
     * @example
     * const sql = `SELECT * FROM "users"`;
     * const result = Database.getInstance().query(sql);
     */
  async query(sql: string) {
    if (!this.pool)
      throw new Error('Database pool is not initialized');
    if (!Database.instance)
      throw new Error('Database instance is not initialized');

    try {
      const client = await this.pool?.connect();
      const result = await client.query(sql);
      client.release();
      return result.rows;
    } catch(err) {
      throw err;
    }
  }
}

export default Database;
