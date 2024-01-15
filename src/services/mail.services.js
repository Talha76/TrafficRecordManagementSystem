import {NotProvidedError, NullValueError} from "../utils/errors.js";
import mailer from "../config/mailer.config.js";

export async function sendLateWarningEmail(vehicle, allowedDuration) {
  if (typeof vehicle === "undefined") throw NotProvidedError("vehicle");
  if (typeof allowedDuration === "undefined") throw NotProvidedError("allowedDuration");
  if (vehicle === null) throw NullValueError("vehicle");
  if (allowedDuration === null) throw NullValueError("allowedDuration");

  const html = `
    <p>This is a warning email for you. You have exceeded your allowed parking time limit <strong>${allowedDuration} minutes</strong>.</p>
    <p>If similar incident occurs later, it may result in banning your vehicle ${vehicle.licenseNumber}</p>
  `;
  const text = `This is a warning email for you. You have exceeded your allowed parking time limit ${allowedDuration} minutes. If similar incident occurs later, it may result in banning your vehicle ${vehicle.licenseNumber}`;
  const subject = "Warning: Exceeded Allowed Parking Time Limit inside IUT Campus";

  await mailer.sendMail({
    from: "noreply@iut-dhaka.edu",
    to: vehicle.userMail,
    subject,
    text,
    html
  });
}

export async function sendBanEmail(vehicle) {
  if (typeof vehicle === "undefined") throw NotProvidedError("vehicle");
  if (vehicle === null) throw NullValueError("vehicle");

  const html = `<p>With a very heavy heart, we are informing you that your vehicle ${vehicle.licenseNumber} has been banned from entering IUT Campus.</p>
  <p>For further information, please contact the authority.</p>`;
  const text = `With a very heavy heart, we are informing you that your vehicle ${vehicle.licenseNumber} has been banned from entering IUT Campus. For further information, please contact the authority.`;
  const subject = "Warning: Exceeded Allowed Parking Time Limit inside IUT Campus";

  await mailer.sendMail({
    from: "noreply@iut-dhaka.edu",
    to: vehicle.userMail,
    subject,
    text,
    html
  });
}
