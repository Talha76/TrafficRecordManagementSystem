import Database from "../../services/Database.class.js";
import User from "../../services/User.class.js";
import axios from 'axios';

async function getAdmin(req, res) {
  try {
    res.render('admin/admin.dashboard.ejs');
  } catch (err) {
    console.error(err);
  }
}

async function postAdmin(req, res) {
  try {
    const user = new User({mail: req.body.mail});
    await user.fetch();
    console.log(user);
    res.send('hello');
  } catch (err) {
    console.error(err);
  }
}

async function postSendImage(req, res) {
  const formData = new FormData();

  for (const key in req.body) {
    formData.append(key, req.body[key]);
  }

  const file = req.files.image;
  const blob = new Blob([file.data], {type: file.mimetype});
  formData.append('image', blob, file.name);

  const response = await axios.post('http://localhost:3001', formData);
  const data = await response.data;

  const licenseNumber = data.area + ' ' + data.number;
  const db = Database.getInstance();
  await db.query(`-- INSERT INTO "vehicle_log" ("license_number") VALUES ('${licenseNumber}')`);

  res.json(data);
}

export {
  getAdmin,
  postAdmin,
  postSendImage,
};