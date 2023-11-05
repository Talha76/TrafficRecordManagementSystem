# User

## Properties

| Name        |    Type     | Available getter | Available setter                         |
|-------------|:-----------:|------------------|------------------------------------------|
| id          |  `number`   | `id`             |                                          |
| name        |  `string`   | `name`           |                                          |
| mail        |  `string`   | `mail`           |                                          |
| password    |  `string`   | `password`       | `async changePassword(password: string)` |
| phoneNumber |  `string`   | `phoneNumber`    |                                          |
| isStudent   |  `boolean`  | `isStudent`      |                                          |
| vehicleList | `Vehicle[]` | `vehicleList`    |                                          |

## Constructor

```typescript
let user = new User({
  name: null,               // Initially set to null
  mail: null,               // Initially set to null
  password: null,           // Initially set to null
  id: null,                 // Initially set to null
  phoneNumber: null,        // Initially set to null
  isStudent: false,         // Initially set to false
  vehicleList: []           // Initially set to empty array
});

// Or you can fetch data of an user with a particular mail
user = new User({
    mail: 'example@gmail.com'
});
await user.fetch();
console.log(user.name, user.mail, user.password, user.id, user.phoneNumber);
console.log(user.isStudent, user.vehicleList);
await user.changePassword('newPassword');
```

## Methods

| Name                                    |    Return Type     | Description                                                                                                                        |
|-----------------------------------------|:------------------:|------------------------------------------------------------------------------------------------------------------------------------|
| `async fetch()`                         | `Promise<boolean>` | After initializing a user, call `fetch()` to fetch data from database. Returns `true` if a user exists. otherwise returns `false`. |
| `async addVehicle(vehicle: Vehicle)`    |  `Promise<void>`   | Adds a vehicle to the user's vehicle list.                                                                                         |
| `async removeVehicle(vehicle: Vehicle)` |  `Promise<void>`   | Removes a vehicle from the user's vehicle list.                                                                                    |
| `async save()`                          |  `Promise<void>`   | Saves the user's data to the database.                                                                                             |

[Back to main documentation](../README.md)
