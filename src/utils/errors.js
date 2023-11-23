export class NotFoundError extends Error {
  constructor(property) {
    super(property + " not found");
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super("User");
  }
}

export class AdminNotFoundError extends NotFoundError {
  constructor() {
    super("Admin");
  }
}

export class VehicleNotFoundError extends NotFoundError {
  constructor() {
    super("Vehicle");
  }
}

export class VehicleLogNotFoundError extends NotFoundError {
  constructor() {
    super("Vehicle log");
  }
}

export class VehicleAllegationNotFoundError extends NotFoundError {
  constructor() {
    super("Vehicle Allegation");
  }
}

export class NotProvidedError extends Error {
  constructor(property) {
    super(property + " must be provided");
  }
}

export class NullValueError extends Error {
  constructor(property) {
    super(property + " must be not null");
  }
}

export class MaxVehicleError extends Error {
  constructor() {
    super("Max vehicle limit reached");
  }
}

export class BannedVehicleError extends Error {
  constructor() {
    super("Vehicle is banned");
  }
}

export class VehicleAlreadyExistsError extends Error {
  constructor() {
    super("Vehicle already exists");
  }
}

export class VehicleAlreadyDeletedError extends Error {
  constructor() {
    super("Vehicle already deleted");
  }
}

export class CustomError extends Error {
  constructor(message) {
    super(message);
  }
}
