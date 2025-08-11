const accountModel = require("../models/account-model")
const utilities = require(".")
    const { body, validationResult } = require("express-validator")
    const validate = {}

/* ***********************
 * Registration Data Validation Rules
 *************************/
validate.registrationRules = () => {
    return [
// firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

// lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

// valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator .js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please login in or use different email.")
                }
            }),

// password is required amd must be strong password
        body("account_password")  
            .trim()
            .notEmpty()
            .isStrongPassword({
                minlength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })  
            .withMessage("Password does not meet requirements."),
    ]
}

/* **
 * Check data and return errors or continue to registration
 ** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
} 

/* **
 * Login data validation rules
 * **/
validate.loginRules = () => {
    return [
//valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator .js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (!emailExists) {
                    throw new Error("Email does not exist. Please register or use a different email.")
                }
            }),

// password is required to login
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password is required."),  
    ]
}

/* **
 * Check data and return errors
 ** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

// Validation rules for the account update information
validate.updateAccountRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator .js docs
            .withMessage("A valid email is required.")
            .custom(async (account_email, { req }) => {
                const currentAccount = await accountModel.getAccountDetails(req.body.account_id)
                if (account_email === currentAccount.account_email) {
                    return true
                }

                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error("Email exists. Please login in or use different email.")
                }
            }),
    ]        
}

// check data and return errors
validate.checkAccountUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

//Validation rules for the password change
validate.changePasswordRules = () => {
    return [
        // password is required amd must be strong password
        body("account_password")  
            .notEmpty()
            .withMessage("Password is required")
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/) 
            .withMessage("Password is required and must meet requirements."),
    ]
}

validate.checkPassword = async (req, res, next) => {
    const { account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Edit Account",
            nav,
            account_id,
        })
        return
    }
    next()
}

module.exports = validate