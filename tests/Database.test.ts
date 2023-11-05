import Database from '../src/config/Database.class';
import { describe, it, expect } from '@jest/globals';

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
  });
});
