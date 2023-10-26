import {
  getAdmin,
  postAdmin,
  getNumberPlateInfo,
  postSendImage,
} from '../../controllers/admin/admin.controllers.js';
import { Router } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: '../../images/',
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage: storage });

const route = Router();

route.get('/', getAdmin);
route.post('/', postAdmin);
route.get('/get-np-info', getNumberPlateInfo);
route.post('/send-image', upload.single('image'),  postSendImage);

export default route;
