import Database from '../config/Database.class.js';
import Person from './Person.class.js';
import Vehicle from './Vehicle.class.js';

/**
 * @class User
 * @description User class
 * @extends Person
 * @param {string} name - Name of the user
 * @param {string} mail - Mail of the user
 * @param {string} password - Password of the user
 * @param {number} id - ID of the user
 * @param {string} phoneNumber - Phone number of the user
 * @param {boolean} isStudent - Is the user a student?
 * @param {Vehicle[]} vehicleList - List of vehicles of the user
 * @since 1.0.0
 * @version 1.0.0
 * @see Person
 * @see Vehicle
 * @constructor User({ name = null, mail = null, password = null, id = null, phoneNumber = null, isStudent = false, vehicleList = [] })
 */
class User extends Person {
  private _id: number;
  private _phoneNumber: string;
  private _isStudent: boolean;
  private _vehicleList: Vehicle[];

  /**
   * @constructor
   * @param name
   * @param mail
   * @param password
   * @param id
   * @param phoneNumber
   * @param isStudent
   * @param vehicleList
   */
  constructor({
    name = null,
    mail = null,
    password = null,
    id = null,
    phoneNumber = null,
    isStudent = false,
    vehicleList = []
  }) {
    super({ name, mail, password });
    this._id = id;
    this._phoneNumber = phoneNumber;
    this._isStudent = isStudent;
    vehicleList.forEach(vehicle => this._vehicleList.push(new Vehicle(vehicle)));
  }

  /**
   * @async
   * @method fetch
   * @description Fetches the user. Call fetch() after creating an instance of a user to get the details of the user from database.
   * @returns {Promise<void>}
   * @since 1.0.0
   * @version 1.0.0
   * @example
   * const user = new User({ mail: 'example@gmail.com' });
   * await user.fetch();
   */
  async fetch() {
    try {
      const sql = `SELECT *
                   FROM "users" JOIN "vehicle_info" ON "users"."mail" = "vehicle_info"."user_mail"
                   WHERE "mail" = '${this.mail}'`;
      const db = Database.getInstance();
      const result = await db.query(sql);

      this._id = result[0].id;
      this._name = result[0].name;
      this._password = result[0].password;
      this._isStudent = result[0].is_student;
      this._phoneNumber = result[0].phone_number;
      this._vehicleList = [];
      result.forEach(vehicle => this._vehicleList.push(new Vehicle({
        licenseNumber: vehicle.license_number,
        vehicleName: vehicle.vehicle_name,
        vehicleOwner: this,
        allowedDuration: vehicle.allowed_duration,
        approvalStatus: vehicle.approval_status
      })));
    } catch(err) {
      throw err;
    }
  }

  /**
   * @method id
   * @description Get the ID of the user
   */
  get id(): number {
    return this._id;
  }

  /**
   * @method phoneNumber
   * @description Get the phone number of the user
   */
  get phoneNumber(): string {
    return this._phoneNumber;
  }

  /**
   * @method isStudent
   * @description Is the user a student?
   */
  get isStudent(): boolean {
    return this._isStudent;
  }

  /**
   * @method vehicleList
   * @description Get the list of vehicles of the user
   */
  get vehicleList(): Vehicle[] {
    return this._vehicleList;
  }

  /**
   * @method addVehicle
   * @param vehicle {Vehicle} - Vehicle to add
   * @description Add a vehicle to the user
   */
  async addVehicle(vehicle: Vehicle) {
    try {
      const db = Database.getInstance();
      const sql = `INSERT INTO "vehicle_info" ("license_number", "vehicle_name", "user_mail")
                   VALUES ('${vehicle.licenseNumber}', '${vehicle.vehicleName}', '${this.mail}')`;
      await db.query(sql);
      this._vehicleList.push(vehicle);
    } catch(err) {
      throw err;
    }
  }

  /**
   * @method removeVehicle
   * @param vehicle {Vehicle} - Vehicle to remove
   * @description Remove a vehicle from the user
   */
  async removeVehicle(vehicle: Vehicle) {
    try {
      const db = Database.getInstance();
      const sql = `DELETE FROM "vehicle_info"
                   WHERE "license_number" = '${vehicle.licenseNumber}'`;
      await db.query(sql);
      this._vehicleList = this._vehicleList.filter(v => v.licenseNumber !== vehicle.licenseNumber);
    } catch(err) {
      throw err;
    }
  }

  /**
   * @async
   * @method save
   * @description Save the user in the database
   */
  async save(){
    try {
      const db = Database.getInstance();
      const sql = `INSERT INTO "users"
                   VALUES ('${this.id}', '${this.name}', '${this.mail}', '${this.password}', '${this.phoneNumber}', ${this.isStudent})`;
      await db.query(sql);
    } catch(err) {
      throw err;
    }
  }

  /**
   * @async
   * @method changePassword
   * @param password {string} - New password
   * @description Change the password of the user
   */
  async changePassword(password: string) {
    try {
      const db = Database.getInstance();
      const sql = `UPDATE "users"
                   SET "password" = ${password}
                   WHERE "id" = ${this._id}`;
      await db.query(sql);
      this._password = password;
    } catch(err) {
      throw err;
    }
  }
}

export default User;
