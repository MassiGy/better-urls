const fs = require("fs");



module.exports.render_home_page = (req, res) => {
    res.render("index");
};


module.exports.render_test_page = (req, res) => {
    res.render("home");
};


module.exports.get_user_urls = (req, res) => {
    fs.readFile("./ressources/url-store.txt", "utf-8", (err, data) => {
        if (err) return res.status(500).send(err.message);
        res.status(200).send(`<code>${data.split("\n")}</code>`);
    })
};



module.exports.download_user_urls =  (req, res) => {
    res.download("./ressources/url-store.txt", (err) => {
        console.log(err.message);
        res.status(500).send("File couldn't be downloaded [INTERNAL SERVER ERROR]");
    });
};

module.exports.visit_user_urls =  (req, res) => {
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
};



module.exports.create_user_url = (req, res) => {

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


};