# Allegation

## Properties

| Name          |   Type   | Available getter | Available setter                    |
|---------------|:--------:|------------------|-------------------------------------|
| id            | `number` | `id`             |                                     |
| licenseNumber | `string` | `licenseNumber`  |                                     |
| lateDuration  | `number` | `lateDuration`   |                                     |
| date          |  `Date`  | `date`           |                                     |
| comment       | `string` | `comment`        | `async setComment(comment: string)` |

## Constructor

```typescript
let allegation = new Allegation({
    id: null,                   // Initially set to null
    licenseNumber: null,        // Initially set to null
    lateDuration: null,         // Initially set to null
    date: null,                 // Initially set to null
    comment: null,              // Initially set to null
});

// Or you can fetch data of an allegation with a particular id
allegation = new Allegation({
    id: 1
});
if (await allegation.fetch() === true) {
    console.log(allegation.id, allegation.licenseNumber);
    await allegation.setComment('Comment');
}
```

## Methods
| Name            |    Return Type     | Description                                                                                                                                      |
|-----------------|:------------------:|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `async fetch()` | `Promise<boolean>` | After initializing an allegation, call `fetch()` to fetch data from database. Returns `true` if an allegation exists. otherwise returns `false`. |
| `async save()`  |  `Promise<void>`   | Saves the allegation's data to the database.                                                                                                     |

[Back to main documentaion](../README.md)
