import Database from '../config/Database.class.js';
import { describe, it, expect } from '@jest/globals';

afterAll(async () => Database.getInstance().end());

describe('Database', () => {
  const db = Database.getInstance();
  it('Should be valid instance', () => {
    expect(db).toBeDefined();
    expect(db).toBeInstanceOf(Database);
  });

  it('Should return a valid response', async () => {
    const sql = `SELECT NOw()`;
    const result = await db.query(sql);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    await db.end();
  });
});
