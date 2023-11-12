import Database from "./Database.class.js";

/**
 * @class Log
 * @description Vehicle log class
 * @property {number} _id
 * @property {string} _licenseNumber
 * @property {Date} _entryTime
 * @property {Date} _exitTime
 * @property {string} _comment
 */
class Log {
  private readonly _id: number;
  private _licenseNumber: string;
  private _entryTime: Date;
  private _exitTime: Date | undefined;
  private _comment: string;

  /**
   * @constructor
   * @param id
   * @param licenseNumber
   * @param entryTime
   * @param exitTime
   * @param comment
   */
  constructor({
                id = null,
                licenseNumber = null,
                entryTime = null,
                exitTime = null,
                comment = null
              }) {
    this._id = id;
    this._licenseNumber = licenseNumber;
    this._entryTime = entryTime;
    this._exitTime = exitTime;
    this._comment = comment;
  }

  /**
   * @async
   * @method fetch
   * @description Fetches the vehicle log. Returns true if a vehicle log exists else returns false. Call fetch() after creating an instance of a vehicle log to get the details of the vehicle log from database.
   * @returns {Promise<boolean>}
   * @since 1.0.0
   * @version 1.0.0
   * @example
   * const vehicleLog = new VehicleLog({ id: 1 });
   * await vehicleLog.fetch();
   */
  async fetch(): Promise<boolean> {
    try {
      const db = Database.getInstance();
      const sql = `SELECT *
                   FROM "vehicle_log"
                   WHERE "id" = ${this._id}`;
      const result = await db.query(sql);
      if (result.length === 0) {
        return false;
      }

      this._licenseNumber = result[0].license_number;
      this._entryTime = result[0].entry_time;
      this._exitTime = result[0].exit_time;
      this._comment = result[0].comment;
      return true;
    } catch (err) {
      throw err;
    }
  }

  get id(): number {
    return this._id;
  }

  get licenseNumber(): string {
    return this._licenseNumber;
  }

  get entryTime(): Date {
    return this._entryTime;
  }

  get exitTime(): Date | undefined {
    return this._exitTime;
  }

  get comment(): string {
    return this._comment;
  }

  async setExitTime(exitTime: Date) {
    try {
      const db = Database.getInstance();
      const sql = `UPDATE "vehicle_log"
                   SET "exit_time" = '${exitTime}'
                   WHERE "id" = ${this._id}`;
      await db.query(sql);
      this._exitTime = exitTime;
    } catch (err) {
      throw err;
    }
  }

  async setComment(comment: string) {
    try {
      const db = Database.getInstance();
      const sql = `UPDATE "vehicle_log"
                   SET "comment" = '${comment}'
                   WHERE "id" = ${this._id}`;
      await db.query(sql);
      this._comment = comment;
    } catch (err) {
      throw err;
    }
  }

  async save() {
    try {
      const db = Database.getInstance();
      const sql = `INSERT INTO "vehicle_log"
                   VALUES (DEFAULT, '${this._licenseNumber}', '${this._entryTime}', '${this._exitTime}',
                           '${this._comment}')`;
      await db.query(sql);
    } catch (err) {
      throw err;
    }
  }
}

export default Log;
