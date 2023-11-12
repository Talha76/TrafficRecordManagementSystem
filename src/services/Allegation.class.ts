import Database from "./Database.class.js";

class Allegation {
  private readonly _id: number;
  private _licenseNumber: string;
  private _lateDuration: number;
  private _date: Date;
  private _comment: string;

  /**
   * @constructor
   * @param id
   * @param licenseNumber
   * @param lateDuration
   * @param date
   * @param comment
   */
  constructor({
                id = null,
                licenseNumber = null,
                lateDuration = null,
                date = null,
                comment = null
              }) {
    this._id = id;
    this._licenseNumber = licenseNumber;
    this._lateDuration = lateDuration;
    this._date = date;
    this._comment = comment;
  }

  /**
   * @async
   * @method fetch
   * @description Fetches the allegation. Returns true if an allegation exists else returns false. Call fetch() after creating an instance of an allegation to get the details of the allegation from database.
   * @returns {Promise<boolean>}
   * @since 1.0.0
   * @version 1.0.0
   * @example
   * const allegation = new Allegation({ id: 1 });
   * await allegation.fetch();
   */
  async fetch(): Promise<boolean> {
    try {
      const db = Database.getInstance();
      const sql = `SELECT *
                   FROM "vehicle_allegation_record"
                   WHERE "id" = ${this._id}`;
      const result = await db.query(sql);
      if (result.length === 0) {
        return false;
      }
      this._licenseNumber = result[0].license_number;
      this._lateDuration = result[0].late_duration;
      this._date = result[0].date;
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

  get lateDuration(): number {
    return this._lateDuration;
  }

  get date(): Date {
    return this._date;
  }

  get comment(): string {
    return this._comment;
  }

  async setComment(comment: string) {
    try {
      const db = Database.getInstance();
      const sql = `UPDATE "vehicle_allegation_record"
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
      const sql = `INSERT INTO "vehicle_allegation_record"
                   VALUES (DEFAULT, '${this._licenseNumber}', ${this._lateDuration}, '${this._date}', '${this._comment}
                           ')`;
      await db.query(sql);
    } catch (err) {
      throw err;
    }
  }
}

export default Allegation;
