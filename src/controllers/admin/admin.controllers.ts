import Database from "../../config/Database.class.js";
import User from "../../models/User.class.js";

async function getAdmin(req, res) {
  try {
    res.render('admin/admin.dashboard.ejs');
  } catch (err) {
    console.error(err);
  }
}

async function postAdmin(req, res) {
  try {
    const user = new User({ mail: req.body.mail });
    await user.initialize();
    console.log(user);
    res.send('hello');
  } catch(err) {
    console.error(err);
  }
}

async function postSendImage(req, res) {
  const formData = new FormData();

  for (const key in req.body) {
    formData.append(key, req.body[key]);
  }

  const file = req.files.image;
  const blob = new Blob([file.data], { type: file.mimetype });
  formData.append('image', blob, file.name);

  const response = await fetch('http://localhost:3001', {
    headers: {
      Accept: 'application/json',
    },
    method: 'POST',
    body: formData
  });
  const data = await response.json();

  const licenseNumber = data.area + '-' + data.number;
  const db = Database.getInstance();
  await db.query(`INSERT INTO "vehicle_log" ("license_number") VALUES ('${licenseNumber}')`);

  res.json(data);
}

export {
  getAdmin,
  postAdmin,
  postSendImage,
};
