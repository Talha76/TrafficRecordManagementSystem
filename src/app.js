import bodyParser from "body-parser";
import flash from "connect-flash";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import initializePassport from "./config/passport.config.js";
import indexRoutes from "./routes/index.routes.js";
import userAuthRoutes from "./routes/user/user.auth.routes.js";
import userRoutes from "./routes/user/user.routes.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import adminAuthRoutes from "./routes/admin/admin.auth.routes.js";

const app = express();

app.use(session({
  secret: "mysecret",
  resave: false,
  saveUninitialized: false
}));

initializePassport(app);

app.use(flash());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

app.use(indexRoutes);
app.use(userAuthRoutes);
app.use(userRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminAuthRoutes);

export default app;
