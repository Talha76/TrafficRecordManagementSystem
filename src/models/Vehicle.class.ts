import User from './User.class.js';

class Vehicle {
  private readonly _licenseNumber: string;
  private readonly _vehicleOwner: User;
  private readonly _vehicleName: string;
  private readonly _allowedDuration: number;
  private readonly _approvalStatus: boolean;

  constructor({
    licenseNumber = null,
    vehicleName = null,
    vehicleOwner = null,
    allowedDuration = null,
    approvalStatus = null
  }) {
    this._licenseNumber = licenseNumber;
    this._vehicleName = vehicleName;
    this._vehicleOwner = vehicleOwner;
    this._allowedDuration = allowedDuration;
    this._approvalStatus = approvalStatus;
  }

  get licenseNumber(): string {
    return this._licenseNumber;
  }

  get vehicleName(): string {
    return this._vehicleName;
  }

  get vehicleOwner(): User {
    return this._vehicleOwner;
  }

  get allowedDuration(): number {
    return this._allowedDuration;
  }

  get approvalStatus(): boolean {
    return this._approvalStatus;
  }
}

export default Vehicle;
