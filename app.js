const express = require("express");
const app = express();
const ejs_mate = require("ejs-mate");
const path = require('path');
const fs = require("fs");
const helmet = require("helmet");
const port = process.env.PORT || 3000;
const { auth } = require('express-openid-connect');


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'LeYhHRPC7811jwbLhk5jkkSN6d5qUv10',
  issuerBaseURL: 'https://better-urls.eu.auth0.com'
};



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/assets', express.static('assets'));
app.use('/images', express.static('images'));


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/auth', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});




app.get("/", (req, res) => {
    res.render("index");
})

app.get("/test", (req, res) => {
    res.render("home");
})



app.get("/data", (req, res) => {
    fs.readFile("./ressources/url-store.txt", "utf-8", (err, data) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).send(`<code>${data.split("\n")}</code>`);
    })
})



app.get("/download", (req, res) => {
    res.download("./ressources/url-store.txt", (err) => {
        console.log(err.message);
        res.status(500).send("File couldn't be downloaded [INTERNAL SERVER ERROR]");
    });
})




app.get("/:endpoint", (req, res) => {
    // access our url key value pair store
    fs.readFile("./ressources/url-store.txt", "utf-8", (err, data) => {
        if (err) return res.status(500).send(err.message);

        // make sure that our file contains the requested end point
        if (!data.includes(req.params.endpoint)) // https://better-urls.up.railway.app/
            return res.status(404).send("Url Not Found");

        // extract the key value pairs from a string stream into an array.
        const data_arr = data.split("\n");

        // find the element that contains the requested url
        let found_record = data_arr.find(el => el.includes(`${req.params.endpoint}`)) // https://better-urls.up.railway.app

        // once found, get the old_url 
        old_url = found_record.split("--->")[1];

        // redirect the user to the old url.

        res.redirect(old_url);
    })
})




app.post("/createUrl", (req, res) => {

    // verify if old endpoint is valid
    if (!req.body.old_url.startsWith("https://"))
        return res.status(400).send("Old url should start with https://");


    // verify if the new endpoint is valid.
    if (!req.body.new_url.startsWith("localhost:3000/")) // https://better-urls.up.railway.app/
        return res.status(400).send("New url should start with localhost:3000/");


    // access our url store file
    fs.readFile("./ressources/url-store.txt", "utf-8", (err, data) => {
        if (err) return res.status(500).send(err.message);

        // make sure the newly created endpoint does not exist yet.
        if (data.includes(req.body.old_url) || data.includes(req.body.new_url))
            return res.status(400).send("Url Already Taken.");

        // create a new key value pair record
        const newRecord = `${req.body.new_url}--->${req.body.old_url}\n`;

        // append the record to the file
        fs.appendFile("./ressources/url-store.txt", newRecord, (err) => {
            if (err) return res.status(500).send(err.message);
        })

        // send back the record to the user
        res.status(200).send(`<code>${newRecord}</code>`);
    })


})



app.listen(port, () => {
    console.log("server on");
})
