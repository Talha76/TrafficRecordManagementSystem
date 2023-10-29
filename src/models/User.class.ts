import Database from '../config/Database.class.js';
import Person from './Person.class.js';
import Vehicle from './Vehicle.class.js';

class User extends Person {
  private _id: number;
  private _phoneNumber: string;
  private _isStudent: boolean;
  private _vehicleList: Vehicle[];

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

  get id(): number {
    return this._id;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get isStudent(): boolean {
    return this._isStudent;
  }

  get vehicleList(): Vehicle[] {
    return this._vehicleList;
  }

  addVehicle(vehicle: Vehicle): void {
    this._vehicleList.push(vehicle);
  }

  removeVehicle(vehicle: Vehicle): void {
    this._vehicleList = this._vehicleList.filter(v => v.licenseNumber !== vehicle.licenseNumber);
  }

  async save(): Promise<void> {
    const db = Database.getInstance();
    const sql = `INSERT INTO "users" VALUES ('${this.id}', ${this.name}', '${this.mail}', '${this.password}', '${this.phoneNumber}', '${this.isStudent}')`;
    await db.query(sql);
  }

  async changePassword(password: string) {
    this._password = password;
    const db = Database.getInstance();
    const sql = `UPDATE "users" SET "password" = ${password} WHERE "id" = ${this._id}`;
    await db.query(sql);
  }
}

export default User;
