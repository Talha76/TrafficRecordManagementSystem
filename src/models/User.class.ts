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
 * @exports User
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
   * @method initialize
   * @description Initialize the user
   * @returns {Promise<void>}
   * @since 1.0.0
   * @version 1.0.0
   * @example
   * const user = new User({ mail: 'example@gmail.com' });
   * await user.initialize();
   */
  async initialize() {
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
  addVehicle(vehicle: Vehicle): void {
    this._vehicleList.push(vehicle);
  }

  /**
   * @method removeVehicle
   * @param vehicle {Vehicle} - Vehicle to remove
   * @description Remove a vehicle from the user
   */
  removeVehicle(vehicle: Vehicle): void {
    this._vehicleList = this._vehicleList.filter(v => v.licenseNumber !== vehicle.licenseNumber);
  }

  /**
   * @async
   * @method save
   * @description Save the user in the database
   */
  async save(){
    const db = Database.getInstance();
    const sql = `INSERT INTO "users" VALUES ('${this.id}', ${this.name}', '${this.mail}', '${this.password}', '${this.phoneNumber}', '${this.isStudent}')`;
    await db.query(sql);
  }

  /**
   * @async
   * @method changePassword
   * @param password {string} - New password
   * @description Change the password of the user
   */
  async changePassword(password: string) {
    this._password = password;
    const db = Database.getInstance();
    const sql = `UPDATE "users" SET "password" = ${password} WHERE "id" = ${this._id}`;
    await db.query(sql);
  }
}

export default User;
