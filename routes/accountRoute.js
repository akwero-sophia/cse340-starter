// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const { registrationRules, checkRegData, loginRules, checkLoginData } = require('../utilities/account-validation');

// Route for when 'My Account' is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route for register button
router.get("/register", utilities.handleErrors(accountController.buildRegistration));

// Route for account login
router.post("/login", loginRules(), checkLoginData, utilities.handleErrors(accountController.accountLogin));

// Route for submitting register form
router.post(
  '/register',
  registrationRules(),
  checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  loginRules(),
  checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Routes for updating account information
router.get("/update", utilities.handleErrors(accountController.buildUpdateView));
router.post("/update", utilities.handleErrors(accountController.updateAccount));
router.post("/change-password", utilities.handleErrors(accountController.changePassword));

module.exports = router;