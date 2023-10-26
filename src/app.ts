import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import morgan from 'morgan';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', './src/views')

app.use(express.static('./src/public'));

import indexRoutes from './routes/index.routes.js';
app.use(indexRoutes);
import adminRoutes from './routes/admin/admin.routes.js';
app.use('/admin', adminRoutes);

export default app;
