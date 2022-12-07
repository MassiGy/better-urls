module.exports.verify_authentication = (req, res, next) => {
    const user_cookie = req.cookies['user-cookie'];
    if (user_cookie) next();
    else {
        req.flash("failure", "Please sign in using the Google button to use the app.");
        return res.render('index', { flash_messages: res.locals["flash-messages"] });
    }
}