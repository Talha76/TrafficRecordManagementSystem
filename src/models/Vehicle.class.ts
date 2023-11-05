import Database from "../config/Database.class.js";
import VehicleLog from "./VehicleLog.class.js";
import Allegation from "./Allegation.class.js";

/**
 * @class Vehicle
 * @description Vehicle class
 * @param {string} licenseNumber - License number of the vehicle
 * @param {string} userMail - Vehicle user's mail
 * @param {string} vehicleName - Name of the vehicle
 * @param {number} allowedDuration - Allowed duration of the vehicle
 * @param {boolean} approvalStatus - Approval status of the vehicle
 * @constructor Vehicle({ licenseNumber = null, userMail = null, vehicleName = null, allowedDuration = null, approvalStatus = null })
 * @since 1.0.0
 * @version 1.0.0
 * @example
 * const vehicle = new Vehicle({
 *  licenseNumber: 'AA-123-AA',
 *  userMail: 'example@gmail.com',
 *  vehicleName: 'Renault Clio',
 *  allowedDuration: 2,
 *  approvalStatus: true
 *  });
 */
class Vehicle {
  private readonly _licenseNumber: string;
  private _userMail: string;
  private _vehicleName: string;
  private _allowedDuration: number;
  private _approvalStatus: boolean;
  private _logs: VehicleLog[];
  private _allegationList: Allegation[];

  /**
   * @constructor
   * @param licenseNumber
   * @param vehicleName
   * @param userMail
   * @param allowedDuration
   * @param approvalStatus
   * @param logs
   * @param allegationList
   */
  constructor({
    licenseNumber = null,
    vehicleName = null,
    userMail = null,
    allowedDuration = 20,
    approvalStatus = false,
    logs = [],
    allegationList = []
  }) {
    this._licenseNumber = licenseNumber;
    this._vehicleName = vehicleName;
    this._userMail = userMail;
    this._allowedDuration = allowedDuration;
    this._approvalStatus = approvalStatus;
    this._logs = logs;
    this._allegationList = allegationList;
  }

  /**
   * @async
   * @method fetch
   * @description Fetches the vehicle. Returns true if a vehicle exists else returns false. Call fetch() after creating an instance of a vehicle to get the details of the vehicle from database.
   * @returns {Promise<boolean>}
   * @since 1.0.0
   * @version 1.0.0
   * @example
   * const vehicle = new Vehicle({ licenseNumber: 'example' });
   * await vehicle.fetch();
   */
  async fetch():Promise<boolean> {
    try {
      const db = Database.getInstance();
      const sql = `SELECT *
                   FROM "vehicle_logs_and_allegations"
                   WHERE "license_number" = '${this._licenseNumber}'`;
      const result = await db.query(sql);
      if (result.length === 0) {
        return false;
      }

      this._vehicleName = result[0].vehicle_name;
      this._userMail = result[0].user_mail;
      this._allowedDuration = result[0].allowed_duration;
      this._approvalStatus = result[0].approval_status;
      this._logs = [];
      this._allegationList = [];
      result.forEach(row => {
        if (row.log_id === null) return;
        const log = new VehicleLog({
          id: row.log_id,
          licenseNumber: row.license_number,
          entryTime: row.entry_time,
          exitTime: row.exit_time,
          comment: row.comment
        });
        this._logs.push(log);
      });
      result.forEach(row => {
        if (row.allegation_id === null) return;
        const allegation = new Allegation({
          id: row.allegation_id,
          licenseNumber: row.license_number,
          lateDuration: row.late_duration,
          date: row.date,
          comment: row.comment
        });
        this._allegationList.push(allegation);
      });
      return true;
    } catch(err) {
      throw err;
    }
  }

  get licenseNumber(): string {
    return this._licenseNumber;
  }

  get userMail(): string {
    return this._userMail;
  }

  get vehicleName(): string {
    return this._vehicleName;
  }

  get allowedDuration(): number {
    return this._allowedDuration;
  }

  get approvalStatus(): boolean {
    return this._approvalStatus;
  }

  get logs(): VehicleLog[] {
    return this._logs;
  }

  get allegationList(): Allegation[] {
    return this._allegationList;
  }

  async setVehicleName(vehicleName: string) {
    try {
      const db = Database.getInstance();
      const sql = `UPDATE "vehicle_info"
                   SET "vehicle_name" = '${vehicleName}'
                   WHERE "license_number" = '${this._licenseNumber}'`;
      await db.query(sql);
      this._vehicleName = vehicleName;
    } catch(err) {
      throw err;
    }
  }

  async setAllowedDuration(allowedDuration: number) {
    try {
      const db = Database.getInstance();
      const sql = `UPDATE "vehicle_info"
                   SET "allowed_duration" = ${allowedDuration}
                   WHERE "license_number" = '${this._licenseNumber}'`;
      await db.query(sql);
      this._allowedDuration = allowedDuration;
    } catch (err) {
      throw err;
    }
  }

  async setApprovalStatus(approvalStatus: boolean) {
    try {
      const db = Database.getInstance();
      const sql = `UPDATE "vehicle_info"
                   SET "approval_status" = ${approvalStatus}
                   WHERE "license_number" = '${this._licenseNumber}'`;
      await db.query(sql);
      this._approvalStatus = approvalStatus;
    } catch(err) {
      throw err;
    }
  }

  async addLog(log: VehicleLog) {
    try {
      const db = Database.getInstance();
      const sql = `INSERT INTO "vehicle_log"
                   VALUES (DEFAULT, '${log.licenseNumber}', '${log.entryTime}', '${log.exitTime}', '${log.comment}')`;
      await db.query(sql);
      this._logs.push(log);
    } catch (err) {
      throw err;
    }
  }

  async addAllegation(allegation: Allegation) {
    try {
      const db = Database.getInstance();
      const sql = `INSERT INTO "vehicle_allegation_record"
                   VALUES (DEFAULT, '${allegation.licenseNumber}', ${allegation.lateDuration}, '${allegation.date}', '${allegation.comment}')`;
      await db.query(sql);
      this._allegationList.push(allegation);
    } catch (err) {
      throw err;
    }
  }
}

export default Vehicle;
