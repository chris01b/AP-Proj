// Import express module
var express = require("express");
// Set router as the express router
var router = express.Router();

/**
 * Render the index.pug file for the root page
 */

router.get("/", function(req, res, next) {
    // Respond with the index.pug view
    res.render("index");
});

// Export the router object
module.exports = router;