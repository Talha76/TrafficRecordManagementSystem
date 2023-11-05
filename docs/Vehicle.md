# Vehicle

## Properties

| Name             |      Type      | Available getter  | Available setter                             |
|------------------|:--------------:|-------------------|----------------------------------------------|
| licenseNumber    |    `string`    | `licenseNumber`   |                                              |
| userMail         |    `string`    | `userMail`        |                                              |
| vehicleName      |    `string`    | `vehicleName`     | `async setVehicleName(vehicleName: string)`  |
| allowedDuration  |    `number`    | `allowedDuration` | `async setAllowedDuration(duration: number)` |
| approvalStatus   |   `boolean`    | `approvalStatus`  | `async setApprovalStatus(status: boolean)`   |
| logs             | `VehicleLog[]` | `logs`            |                                              |
| allegationList   | `Allegation[]` | `allegationList`  |                                              |

## Constructor

```typescript
let vehicle = new Vehicle({
  licenseNumber: null,      // Initially set to null
  userMail: null,           // Initially set to null
  vehicleName: null,        // Initially set to null
  allowedDuration: 20,      // Initially set to 20 minutes
  approvalStatus: false,    // Initially set to false
});

// Or you can fetch data of a vehicle with a particular license number
vehicle = new Vehicle({
    licenseNumber: '123456'
});
if (await vehicle.fetch() === true) {
    const userMail = vehicle.userMail;
    console.log(vehicle.licenseNumber, vehicle.vehicleName);
    await vehicle.setVehicleName('Car');
}
```

## Methods
| Name                                          |    Return Type     | Description                                                                                                                               |
|-----------------------------------------------|:------------------:|-------------------------------------------------------------------------------------------------------------------------------------------|
| `async fetch()`                               | `Promise<boolean>` | After initializing a vehicle, call `fetch()` to fetch data from database. Returns `true` if a vehicle exists. otherwise returns `false`.  |
| `async addLog(log: VehicleLog)`               |  `Promise<void>`   | Adds a log to the vehicle's log list.                                                                                                     |
| `async addAlligation(allegation: Allegation)` |  `Promise<void>`   | Adds an allegation to the vehicle's allegation list.                                                                                      |
| `async save()`                                |  `Promise<void>`   | Saves the vehicle's data to the database.                                                                                                 |

[Back to main documentaion](../README.md)
