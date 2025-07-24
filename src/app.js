import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectMongoDb from "./config/db.js";
import { initPassport } from "./config/passportLocal.js";
import { initPassportJwt } from "./config/passportJwt.js";
import sessionRouter from "./routes/sessions.routes.js";
import userRouter from "./routes/users.router.js";
import passwordRouter from "./routes/password.routes.js";
import cartRouter from "./routes/cart.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

connectMongoDb();


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//iniciar passport
initPassport();
initPassportJwt();

//routes
app.use("/api/sessions", sessionRouter);
app.use("/api/users", userRouter);
app.use("/api/password", passwordRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => { console.log(`Servidor iniciado en http://localhost:${PORT}`);});