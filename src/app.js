import bodyParser from "body-parser";
import flash from "connect-flash";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import indexRoutes from "./routes/index.routes.js";
import userAuthRoutes from "./routes/user/user.auth.routes.js";
import userRoutes from "./routes/user/user.routes.js";

const app = express();

app.use(session({
  secret: "mysecret", resave: false, saveUninitialized: false
}));
app.use(flash());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(express.static("public")); // Assuming your CSS files are in a folder named 'public'


app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

app.use(fileUpload());

app.use(indexRoutes);
app.use(userAuthRoutes);
app.use("/dashboard", userRoutes);

export default app;
