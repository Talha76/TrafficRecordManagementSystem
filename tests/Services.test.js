import {describe, it, expect, afterAll} from "@jest/globals";
import * as User from "../src/services/User.services.js";
import sequelize from "../src/config/sequelize.config.js";

afterAll(async () => sequelize.close());

describe("User Services Tests", () => {
  it ("Should return a valid user when querying by ID", async () => {
    const user = await User.findUserById(200042124);
    expect(user).not.toBeNull();
  });

  it ("Should return a valid user when querying by email", async () => {
    const user = await User.findUserByEmail("mushfiqurtalha@iut-dhaka.edu");
    expect(user).not.toBeNull();
  });
});
