import {Router} from 'express';
import indexControllers from '../controllers/index.controllers.js';

const route = Router();

route.get('/', indexControllers.getIndex);

export default route;
