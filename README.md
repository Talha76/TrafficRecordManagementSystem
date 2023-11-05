# Traffic Record Management System <!-- omit in toc -->

***

## Introduction <!-- omit in toc -->

***

[//]: # (TODO: Write introduction)

## Table of Contents <!-- omit in toc -->

***

- [Installation](#installation)
- [Usage](#usage)
- [Class Diagram](#class-diagram)
- [API Documentation](#api-documentation)
- [Classes](#classes)
  - [Vehicle](./docs/Vehicle.md)
  - [User](./docs/User.md)
  - [Allegation](./docs/Allegation.md)
  - [VehicleLog](./docs/VehicleLog.md)

## Installation

***

[//]: # (TODO: Write installation procedure)

## Usage

***

Clone this repository:

```bash
git clone github.com/Talha76/TrafficRecordManagementSystem
```

Change directory to the project directory, and run the following commands:

```bash
npm install # install dependencies
npm run dev # run the project in development mode
```

The server will run at http://localhost:3000.

[//]: # (TODO: Write remaining usage procedure)

## Class Diagram

```mermaid
classDiagram
  Person <|-- User
  Person : +string name
  Person : +string mail
  Person : +string password
  Person : +getter() for all the attributes
  class User {
    +number id
    +string phoneNumber
    +boolean isStudent
    +Vehicle[] vehicleList
    +getter() for all of the attributes
    +async fetch(): boolean
    +async addVehicle(vehicle: Vehicle)
    +async removeVehicle(vehicle: Vehicle)
    +async changePassword(password: string)
    +async save()
  }
  class Vehicle {
    +string licenseNumber
    +string vehicleName
    +User vehicleOwner
    +number allowedDuration
    +boolean approvalStatus
    +getter() for all the attributes
    +async fetch(): boolean
    +async setVehicleName(vehicleName: string)
    +async setAllowedDuration(duration: number)
    +async setApprovalStatus(status: boolean)
    +async save()
  }
  class Allegation {
    +number id
    +string licenseNumber
    +number lateDuration
    +Date date
    +string comment
    +getter() for all the attributes
    +async fetch(): boolean
    +async setComment(comment: string)
    +async save()
  }
  class VehicleLog {
    +number id
    +string licenseNumber
    +Date entryTime
    +Date exitTime
    +number comment
    +getter() for all the attributes
    +async fetch(): boolean
    +async setExitTime(exitTime: Date)
    +async setComment(comment: string)
    +async save()
  }
```

## API Documentation

***

## Classes

- [Vehicle](./docs/Vehicle.md)
- [User](./docs/User.md)
- [Allegation](./docs/Allegation.md)
- [VehicleLog](./docs/VehicleLog.md)


