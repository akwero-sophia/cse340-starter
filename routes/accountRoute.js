// Required external modules
const express = require("express");
const router = express.Router();

// Required internal modules
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to handle GET request for "My Account" page
router.get("/", utilities.handleErrors(accountController.buildAccount));

// Export the router
module.exports = router;
