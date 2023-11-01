import {
  getAdmin,
  postAdmin,
  postSendImage,
} from '../../controllers/admin/admin.controllers.js';
import { Router } from 'express';

const router = Router();

router.get('/', getAdmin);
router.post('/', postAdmin);
router.post('/send-image', postSendImage);

export default router;
