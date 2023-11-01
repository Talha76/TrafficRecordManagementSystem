import Database from '../src/config/Database.class';
import { describe, it, expect } from '@jest/globals';

describe('Database', () => {
  const db = Database.getInstance();
  it('Should be valid instance', () => {
    expect(db).toBeDefined();
    expect(db).toBeInstanceOf(Database);
  });

  it('Should return a valid user', async () => {
    const mail = 'a@gmail.com';
    const sql = `SELECT *
                 FROM user_vehicle_info
                 WHERE mail = '${mail}'`;
    const result = await db.query(sql);
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
  });

  it('Should return a valid user even though a car is not registered to his/her name', async () => {
    const mail = 'a@mail.co';
    const sql = `SELECT *
                 FROM user_vehicle_info
                 WHERE mail = '${mail}'`;
    const result = await db.query(sql);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    await db.end();
  })
});
