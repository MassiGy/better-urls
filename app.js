const express = require("express");
const app = express();
const ejs_mate = require("ejs-mate");
const path = require('path');
const fs = require("fs");
const helmet = require("helmet");
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.engine('ejs', ejs_mate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));





app.get("/", (req, res) => {
    res.render("home");
})



app.get("/data", (req,res)=>{
    fs.readFile("./ressources/url-store.txt", "utf-8", (err, data) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).send(`<code>${data.split("\n")}</code>`);
    })
})


app.get("/:endpoint", (req, res) => {
    // access our url key value pair store
    fs.readFile("./ressources/url-store.txt", "utf-8", (err, data) => {
        if (err) return res.status(500).send(err.message);

        // make sure that our file contains the requested end point
        if (!data.includes(`https://better-urls.herokuapp.com/` + req.params.endpoint))
            return res.status(404).send("Url Not Found");

        // extract the key value pairs from a string stream into an array.
        const data_arr = data.split("\n");
        let pos = [];

        // find the index of the element that contains the requested url
        data_arr.forEach((el, i) => {
            if (el.includes(`https://better-urls.herokuapp.com/${req.params.endpoint}`)) pos.push(i);
        })

        // once found, get the old_url 
        old_url = data_arr[pos].split("--->")[1];

        // redirect the user to the old url.
        res.redirect(old_url);
    })
})




app.post("/createUrl", (req, res) => {

    // verify if the new endpoint is valid.
    if (!req.body.new_url.startsWith("https://better-urls.herokuapp.com/"))
        return res.status(400).send("New url should start with https://better-urls.herokuapp.com/");

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
