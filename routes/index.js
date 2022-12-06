const api_controlers = require("../controllers/api");
const express = require("express");
const router = express.Router();




router.get("/", api_controlers.render_home_page);
router.get("/test", api_controlers.render_test_page);
router.get("/data", api_controlers.get_user_urls)
router.get("/download", api_controlers.download_user_urls)
router.get("/:endpoint", api_controlers.visit_user_urls)




router.post("/createUrl", api_controlers.create_user_url);



module.exports = router;

