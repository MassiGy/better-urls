if (process.NODE_ENV != "production") {
    require("dotenv").config()
}

const express = require("express");
const app = express();
const ejs_mate = require("ejs-mate");
const path = require('path');
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const flash = require("req-flash");

const port = process.env.PORT || 3000;
const api_routes = require("./routes/index");
const session_options = {
    saveUninitialized: false,
    resave: true,
    httpOnly: true,
    secret: process.env.SESSION_SECRET,
    name: "session-expressjs",
}




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static('assets'));
app.use('/images', express.static('images'));
app.use(sessions(session_options));
app.use(cookieParser());
app.use(flash({ locals: "flash-messages" })); // make flash messages availible in the res object


app.use(api_routes);




app.listen(port, () => {
    console.log("server on");
})
