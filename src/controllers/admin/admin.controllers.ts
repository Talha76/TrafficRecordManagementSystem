import Database from "../../config/Database.js";

function getAdmin(req, res) {
  res.render('admin/admin.dashboard.ejs');
}

function postAdmin(req, res) {
  console.log(req.body);
  res.redirect('/admin');
}

async function postSendImage(req, res) {
  const formData = new FormData();

  for (const key in req.body) {
    formData.append(key, req.body[key]);
  }

  const blob = new Blob([req.file], { type: req.file.mimetype });
  console.log(blob);
  formData.append('image', blob, req.file.filename);

  console.log(req.file);
  console.log(formData);

  const response = await fetch('http://localhost:3001', {
    headers: {
      Accept: 'application/json; charset=utf-8',
    },
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  console.log(data);
  res.json(data);
}

async function getNumberPlateInfo(req, res) {
  console.log(req.body);

  const licenseNumber = req.body.area + req.body.number;

  const db = Database.getInstance();
  const sql = `INSERT INTO "vehicle_log" ("license_number") `
    + `VALUES ('${licenseNumber})`;
  await db.query(sql);
  // console.log('Successfully insert into database');

  res.redirect('/admin');
}

export {
  getAdmin,
  postAdmin,
  postSendImage,
  getNumberPlateInfo,
};
