const { is_google_credentials_valid } = require("./verify_google_credentials");

module.exports.verify_authentication = (req, res, next) => {
    const user_data = req.cookies['user-cookie'];

    if (user_data && is_google_credentials_valid(user_data) == true) {
        return next();
    } else {
        req.flash("failure", "Please sign in using the Google button to use the app.");
        return res.render('index', { flash_messages: res.locals["flash-messages"] });
    }
}