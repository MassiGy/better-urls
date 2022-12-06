const express = require("express");
const app = express();
const ejs_mate = require("ejs-mate");
const path = require('path');
const helmet = require("helmet");
const port = process.env.PORT || 3000;
const api_routes = require("./routes/index");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static('assets'));
app.use('/images', express.static('images'));




app.use("/", api_routes);




app.listen(port, () => {
    console.log("server on");
})
