// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

//  Route to build the Management view
router.get("/", utilities.checkLogin,utilities.handleErrors(accountController.buildManagementView));

// route to access log out process
router.get("/logout", utilities.handleErrors(accountController.logout));

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

// Route to build the register view
router.get("/register", utilities.handleErrors(accountController.buildRegisterView));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//route to build account update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdateView));

// Process for account update
router.post(
  "/update-account",
  regValidate.updateAccountRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process for password change
router.post(
  "/update-password",
  regValidate.changePasswordRules(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.changePassword)
);
 
module.exports = router;