import Database from "../config/Database.class.js";
import User from './User.class.js';

/**
 * @class Vehicle
 * @description Vehicle class
 * @param {string} licenseNumber - License number of the vehicle
 * @param {User} vehicleOwner - Owner of the vehicle
 * @param {string} vehicleName - Name of the vehicle
 * @param {number} allowedDuration - Allowed duration of the vehicle
 * @param {boolean} approvalStatus - Approval status of the vehicle
 * @constructor Vehicle({ licenseNumber = null, vehicleOwner = null, vehicleName = null, allowedDuration = null, approvalStatus = null })
 * @since 1.0.0
 * @version 1.0.0
 * @example
 * const vehicle = new Vehicle({
 *  licenseNumber: 'AA-123-AA',
 *  vehicleOwner: user,
 *  vehicleName: 'Renault Clio',
 *  allowedDuration: 2,
 *  approvalStatus: true
 *  });
 */
class Vehicle {
  private readonly _licenseNumber: string;
  private readonly _vehicleOwner: User;
  private _vehicleName: string;
  private _allowedDuration: number;
  private _approvalStatus: boolean;

  /**
   * @constructor
   * @param licenseNumber
   * @param vehicleName
   * @param vehicleOwner
   * @param allowedDuration
   * @param approvalStatus
   */
  constructor({
    licenseNumber = null,
    vehicleName = null,
    vehicleOwner = null,
    allowedDuration = 20,
    approvalStatus = false
  }) {
    this._licenseNumber = licenseNumber;
    this._vehicleName = vehicleName;
    this._vehicleOwner = vehicleOwner;
    this._allowedDuration = allowedDuration;
    this._approvalStatus = approvalStatus;
  }

  /**
   * @method licenseNumber
   * @description Get the license number of the vehicle
   * @returns {string}
   */
  get licenseNumber(): string {
    return this._licenseNumber;
  }

  /**
   * @method vehicleName
   * @description Get the name of the vehicle
   * @returns {string}
   */
  get vehicleName(): string {
    return this._vehicleName;
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

  /**
   * @method vehicleOwner
   * @description Get the owner of the vehicle
   * @returns {User}
   */
  get vehicleOwner(): User {
    return this._vehicleOwner;
  }

  /**
   * @method allowedDuration
   * @description Get the allowed duration of the vehicle
   * @returns {number}
   */
  get allowedDuration(): number {
    return this._allowedDuration;
  }

  /**
   * @method setAllowedDuration
   * @description Set the allowed duration of the vehicle
   */
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

  /**
   * @method approvalStatus
   * @description Get the approval status of the vehicle
   * @returns {boolean}
   */
  get approvalStatus(): boolean {
    return this._approvalStatus;
  }

  /**
   * @method setApprovalStatus
   * @description Set the approval status of the vehicle
   */
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
}

export default Vehicle;
