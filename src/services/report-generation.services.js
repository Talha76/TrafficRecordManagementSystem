import latexToPdf from "../utils/latex.js";
import {NullValueError} from "../utils/errors.js";
import {Op} from "sequelize";
import {printableDateTime, queryTypes, zip} from "../utils/utility.js";
import VehicleLog from "../models/vehicle-log.model.js";
import {findUserByVehicle} from "./user.services.js";
import VehicleAllegation from "../models/vehicle-allegation.model.js";
import Vehicle from "../models/vehicle.model.js";
import User from "../models/user.model.js";

function initHeadings(headings) {
  let latex = "\\begin{tabular}{|";

  for (const heading of headings) {
    latex += "c|";
  }
  latex += "}\n\\hline\n";

  for (const heading of headings) {
    latex += `\\textbf{${heading}} & `;
  }
  latex = latex.slice(0, -2);
  latex += "\\\\\n\\hline\\hline\n";

  return latex;
}

/**
 * Generates a PDF report from the given data.
 * @param headings - Headings of the table columns{Array<String>}
 * @param props - Properties of the data object{Array<String>}
 * @param data - Data to be displayed{Array<Object>}
 */
async function generate(headings, props, data) {
  let latex = initHeadings(headings);

  let i = 0;
  for (; i < Math.min(30, data.length); i++) {
    for (const prop of props) {
      latex += `${data[i][prop]} & `;
    }
    latex = latex.slice(0, -2);
    latex += "\\\\\n\\hline\n";
  }
  latex += "\\end{tabular}\n";

  for (i = 35; i < data.length;) {
    latex += initHeadings(headings);
    for (let j = 0; j < 45 && i < data.length; j++, i++) {
      for (const prop of props) {
        latex += `${data[i][prop]} & `;
      }
      latex = latex.slice(0, -2);
      latex += "\\\\\n\\hline\n";
    }
    latex += "\\end{tabular}\n";
  }

  await latexToPdf(latex);
}

/**
 * Generates a report from the given options.
 * @param opts - Options for the report generation{licenseNumber, userId, queryType, entryFrom, entryTo}
 */
export default async function generateReport(opts) {
  if (opts === undefined) opts = {};

  const headings = ["User ID", "License Number", "Entry Time", "Exit Time", "Late Duration"],
    props = ["userId", "licenseNumber", "entryTime", "exitTime", "lateDuration"];
  const data = [];
  let queries = {};

  attachEntryTime(queries, opts.entryFrom, opts.entryTo);

  if (opts.userId !== undefined) {
    if (opts.userId === null) throw new NullValueError("userId");
    const user = await User.findByPk(opts.userId);
    const vehicles = await Vehicle.findAll({where: {userMail: user.email}});
    queries.licenseNumber = {
      [Op.in]: vehicles.map(vehicle => vehicle.licenseNumber)
    };
  }

  if (opts.licenseNumber !== undefined) {
    if (opts.licenseNumber === null) throw new NullValueError("licenseNumber");
    queries.licenseNumber = opts.licenseNumber;
  }

  if (opts.queryType === undefined) {
    let logs = await VehicleLog.findAll({where: queries});

    const userPromises = [];
    for (const log of logs) {
      userPromises.push(findUserByVehicle(log.licenseNumber));
    }
    const users = await Promise.all(userPromises);

    for (const [user, log] of zip([users, logs])) {
      const time = log.exitTime === null ? new Date() : log.exitTime;
      data.push({
        userId: user.id,
        licenseNumber: log.licenseNumber,
        entryTime: printableDateTime(log.entryTime),
        exitTime: log.exitTime === null ? "Not Exited" : printableDateTime(log.exitTime),
        lateDuration: Math.floor(Math.max(0, (time - log.entryTime) / 60000 - log.allowedDuration))
      });
    }
  } else if (opts.queryType === queryTypes.CURRENTLY_IN_IUT) {
    queries.exitTime = null;
    let logs = await VehicleLog.findAll({where: queries});
    const userPromises = [];
    for (const log of logs) {
      userPromises.push(findUserByVehicle(log.licenseNumber));
    }
    const users = await Promise.all(userPromises);

    for (const [user, log] of zip([users, logs])) {
      data.push({
        userId: user.id,
        licenseNumber: log.licenseNumber,
        entryTime: printableDateTime(log.entryTime),
        exitTime: "Not Exited",
        lateDuration: Math.floor(Math.max(0, (new Date() - log.entryTime) / 60000 - log.allowedDuration))
      });
    }
  } else if (opts.queryType === queryTypes.LATE_ONLY) {
    let logs = await VehicleLog.findAll({where: queries});
    const allegations = await VehicleAllegation.findAll({
      where: {
        logId: {
          [Op.in]: logs.map(log => log.id)
        }
      }
    });

    const logPromises = [];
    for (const allegation of allegations) {
      logPromises.push(VehicleLog.findByPk(allegation.logId));
    }
    logs = await Promise.all(logPromises);

    const userPromises = [];
    for (const log of logs) {
      userPromises.push(findUserByVehicle(log.licenseNumber));
    }
    const users = await Promise.all(userPromises);


    for (const [user, log, allegation] of zip([users, logs, allegations])) {
      data.push({
        userId: user.id,
        licenseNumber: log.licenseNumber,
        entryTime: printableDateTime(log.entryTime),
        exitTime: log.exitTime === null ? "Not Exited" : printableDateTime(log.exitTime),
        lateDuration: allegation.lateDuration
      });
    }
  } else if (opts.queryType === queryTypes.BANNED_ONLY) {
    const vehicles = await Vehicle.findAll({where: {defaultDuration: 0}});
    queries.licenseNumber = {
      [Op.in]: vehicles.map(vehicle => vehicle.licenseNumber)
    };
    const logs = await VehicleLog.findAll({where: queries});

    const userPromises = [];
    for (const log of logs) {
      userPromises.push(findUserByVehicle(log.licenseNumber));
    }
    const users = await Promise.all(userPromises);

    for (const [user, log] of zip([users, logs])) {
      const time = log.exitTime === null ? new Date() : log.exitTime;
      data.push({
        userId: user.id,
        licenseNumber: log.licenseNumber,
        entryTime: printableDateTime(log.entryTime),
        exitTime: log.exitTime === null ? "Not Exited" : printableDateTime(log.exitTime),
        lateDuration: Math.floor(Math.max(0, (time - log.entryTime) / 60000 - log.allowedDuration))
      });
    }
  }

  await generate(headings, props, data);
}

function attachEntryTime(query, entryFrom, entryTo) {
  if (entryFrom !== undefined) {
    if (entryFrom === null) throw new NullValueError("entryFrom");
    query.entryTime = {
      [Op.gte]: entryFrom
    };
  } else {
    query.entryTime = {
      [Op.gte]: new Date("1970-01-01")
    };
  }

  if (entryTo !== undefined) {
    if (entryTo === null) throw new NullValueError("entryTo");
    query.entryTime = {
      [Op.lte]: entryTo
    };
  } else {
    query.entryTime = {
      [Op.lte]: new Date()
    };
  }
}
