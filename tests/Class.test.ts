import { describe, it, expect } from "@jest/globals";
import User from "../src/models/User.class";
import Database from "../src/config/Database.class";
import Vehicle from "../src/models/Vehicle.class";
import VehicleLog from "../src/models/VehicleLog.class";
import Allegation from "../src/models/Allegation.class";

describe ('User Class', () => {
  it ('Should be a valid instance', () => {
    const user = new User({});
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  it ('Should have following properties', () => {
    const user = new User({});
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('_phoneNumber');
    expect(user).toHaveProperty('_isStudent');
    expect(user).toHaveProperty('_vehicleList');
    expect(user.vehicleList).toHaveLength(0);
  });

  it ('Should be able to fetch users with no vehicles.', async () => {
    try {
      const mail = 'a@mail.co';
      const user = new User({mail: mail});
      if (await user.fetch() === false) {
        throw new Error('User not found.');
      }
      expect(user.vehicleList).toHaveLength(0);
    } catch (err) {
      console.error(err);
    } finally {
      await Database.getInstance().end();
    }
  });
});

describe('Vehicle Class', () => {
  it ('Should be a valid instance', () => {
    const vehicle = new Vehicle({});
    expect(vehicle).toBeDefined();
    expect(vehicle).toBeInstanceOf(Vehicle);
  });

  it ('Should have following properties', () => {
    const vehicle = new Vehicle({});
    expect(vehicle).toHaveProperty('_licenseNumber');
    expect(vehicle).toHaveProperty('_userMail');
    expect(vehicle).toHaveProperty('_vehicleName');
    expect(vehicle).toHaveProperty('_allowedDuration');
    expect(vehicle).toHaveProperty('_approvalStatus');
    expect(vehicle).toHaveProperty('_allegationList');
    expect(vehicle).toHaveProperty('_logs');
  });

  it ('Should be able to fetch a vehicle with no logs and allegations', async () => {
    try {
      const licenseNumber = '1';
      const vehicle = new Vehicle({ licenseNumber: licenseNumber });
      if (await vehicle.fetch() === false) {
        throw new Error('Vehicle not found.');
      }
      expect(vehicle.logs).toHaveLength(0);
      expect(vehicle.allegationList).toHaveLength(0);
    } catch (err) {
      console.error(err);
    } finally {
      await Database.getInstance().end();
    }
  });
});

describe ('VehicleLog Class', () => {
  it ('Should be a valid instance', () => {
    const vehicleLog = new VehicleLog({});
    expect(vehicleLog).toBeDefined();
    expect(vehicleLog).toBeInstanceOf(VehicleLog);
  });

  it ('Should have following properties', () => {
    const vehicleLog = new VehicleLog({});
    expect(vehicleLog).toHaveProperty('_id');
    expect(vehicleLog).toHaveProperty('_licenseNumber');
    expect(vehicleLog).toHaveProperty('_entryTime');
    expect(vehicleLog).toHaveProperty('_exitTime');
    expect(vehicleLog).toHaveProperty('_comment');
  });
});

describe ('Allegation Class', () => {
  it ('Should be a valid instance', () => {
    const allegation = new Allegation({});
    expect(allegation).toBeDefined();
    expect(allegation).toBeInstanceOf(Allegation);
  });

  it ('Should have following properties', () => {
    const allegation = new Allegation({});
    expect(allegation).toHaveProperty('_id');
    expect(allegation).toHaveProperty('_licenseNumber');
    expect(allegation).toHaveProperty('_lateDuration');
    expect(allegation).toHaveProperty('_date');
    expect(allegation).toHaveProperty('_comment');
  });
});
