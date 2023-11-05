# VehicleLog

## Properties

| Name          |   Type   | Available getter | Available setter                    |
|---------------|:--------:|------------------|-------------------------------------|
| id            | `number` | `id`             |                                     |
| licenseNumber | `string` | `licenseNumber`  |                                     |
| entryTime     |  `Date`  | `entryTime`      |                                     |
| exitTime      |  `Date`  | `exitTime`       | `async setExitTime(exitTime: Date)` |
| comment       | `string` | `comment`        | `async setComment(comment: string)` |

## Constructor

```typescript
let vehicleLog = new VehicleLog({
    id: null,                   // Initially set to null
    licenseNumber: null,        // Initially set to null
    entryTime: null,            // Initially set to null
    exitTime: null,             // Initially set to null
    comment: null,              // Initially set to null
});

// Or you can fetch data of a vehicle log with a particular id
vehicleLog = new VehicleLog({
    id: 1
});
if (await vehicleLog.fetch() === true) {
    console.log(vehicleLog.id, vehicleLog.licenseNumber);
    await vehicleLog.setExitTime(new Date());
    await vehicleLog.setComment('Comment');
}
```

## Methods

| Name            |    Return Type     | Description                                                                                                                                      |
|-----------------|:------------------:|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `async fetch()` | `Promise<boolean>` | After initializing a vehicle log, call `fetch()` to fetch data from database. Returns `true` if a vehicle log exists. otherwise returns `false`. |
| `async save()`  |  `Promise<void>`   | Saves the vehicle log's data to the database.                                                                                                    |

[Back to main documentaion](../README.md)
