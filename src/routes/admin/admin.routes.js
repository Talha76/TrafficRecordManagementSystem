import {
  getAdmin,
  postAdmin,
  postSendImage,
} from '../../controllers/admin/admin.controllers.js';
import { Router } from 'express';

const route = Router();

route.get('/', getAdmin);
route.post('/', postAdmin);
route.post('/send-image', postSendImage);

export default route;