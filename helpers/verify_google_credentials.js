


module.exports.is_google_credentials_valid = (credentials) => {

    if (credentials.aud != process.env.GOOGLE_CLIENT_ID) {
        return false;
    }

    if (credentials.iss != "https://accounts.google.com") {
        return false;
    }
    
    return true;

}