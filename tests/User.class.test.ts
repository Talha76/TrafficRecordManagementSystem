import { describe, it, expect } from "@jest/globals";
import User from "../src/models/User.class";
import exp = require("constants");

describe('User class tests.', () => {
  const user = new User({});
  it('Should be a valid instance', () => {
    expect(user).toBeDefined();
    expect(user).toBeInstanceOf(User);
  });

  it ('Should have following properties', () => {
    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('_phoneNumber');
    expect(user).toHaveProperty('_isStudent');
    expect(user).toHaveProperty('_vehicleList');
    expect(user.vehicleList).toHaveLength(0);
  })
})
