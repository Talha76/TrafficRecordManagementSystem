import {NotProvidedError, NullValueError} from "../utils/errors.js";
import mailer from "../config/mailer.config.js";

export async function sendLateWarningEmail(userMail, licenseNumber, allowedDuration) {
  if (typeof userMail === "undefined") throw NotProvidedError("userMail");
  if (typeof licenseNumber === "undefined") throw NotProvidedError("licenseNumber");
  if (typeof allowedDuration === "undefined") throw NotProvidedError("allowedDuration");
  if (userMail === null) throw NullValueError("userMail");
  if (licenseNumber === null) throw NullValueError("licenseNumber");
  if (allowedDuration === null) throw NullValueError("allowedDuration");

  const html = `
    <p>This is a warning email for you. You have exceeded your allowed parking time limit <strong>${allowedDuration} minutes</strong>.</p>
    <p>If similar incident occurs later, it may result in banning your vehicle ${licenseNumber}</p>
  `;
  const text = `This is a warning email for you. You have exceeded your allowed parking time limit ${allowedDuration} minutes. If similar incident occurs later, it may result in banning your vehicle ${licenseNumber}`;
  const subject = "Warning: Exceeded Allowed Parking Time Limit inside IUT Campus";

  await mailer.sendMail({
    from: "noreply@iut-dhaka.edu",
    to: userMail,
    subject,
    text,
    html
  });
}

export async function sendBanEmail(userMail, licenseNumber) {
  if (typeof userMail === "undefined") throw NotProvidedError("userMail");
  if (typeof licenseNumber === "undefined") throw NotProvidedError("licenseNumber");
  if (userMail === null) throw NullValueError("userMail");
  if (licenseNumber === null) throw NullValueError("licenseNumber");

  const html = `<p>With a very heavy heart, we are informing you that your vehicle ${licenseNumber} has been banned from entering IUT Campus.</p>
  <p>For further information, please contact the authority.</p>`;
  const text = `With a very heavy heart, we are informing you that your vehicle ${licenseNumber} has been banned from entering IUT Campus. For further information, please contact the authority.`;
  const subject = "Vehicle Banned from Entering IUT Campus";

  await mailer.sendMail({
    from: "noreply@iut-dhaka.edu",
    to: userMail,
    subject,
    text,
    html
  });
}
