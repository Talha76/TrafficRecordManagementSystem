import { Router } from 'express';
import {
  getIndex,
} from '../controllers/index.controllers.js';

const route = Router();

route.get('/', getIndex);

export default route;
