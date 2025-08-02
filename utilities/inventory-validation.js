const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **
 * Add classification data validation rules.
 * **/    
validate.addClassificationRules = () => {
    return [
        //classification_name is required and must be a string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .matches(/^[A-Za-z]+$/)
            .withMessage("Provide a correct classification name."),
    ]
}

/* **
 * Check data and return erros or continue to add the classification
 * **/    
validate.checkAddData = async (req, res, next) => {
    const {classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* **
 * Add classification data validation rules.
 * **/  
validate.addInventoryRules = () => {
    return [
        // classification name is required. Must be selected from the drop down select list.
        body("classification_id")
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage("A classification must be selected."),

        // the make is required
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[A-Za-z]{3}$/)
            .withMessage("Provide a make."),

        // the model is required
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[A-Za-z]{3}$/)
            .withMessage("Provide a model."),   
            
        // the description is required
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Provide a description."),    

        // the price is required    
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d+(\.\d{1,2})?$/)
            .withMessage("Provide a price."),

        // the year is required
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d{4}$/)
            .withMessage("Provide a year."), 
        
        // the miles are required    
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\d+$/)
            .withMessage("Provide the miles."),    

        // the color is required
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^[A-Za-z]+$/)
            .withMessage("Provide a color."),    
    ]
}

/* **
 * Check data and return erros or continue to add the car
 * **/    
validate.checkNewVehicleData = async (req, res, next) => {
    const { 
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let list = await utilities.buildClassificationList()
        res.render("./inventory/add-inventory", {
            errors,
            title: " ",
            nav: null,
            list,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        })
        return
    }
    next()
}


module.exports = validate