// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to build the register view
router.get("/register", utilities.handleErrors(accountController.buildRegisterView));
 
module.exports = router