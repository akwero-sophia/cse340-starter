const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* **
 * Build inventory by classification view
 * **/
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* **
 * Build inventory detail view
 * **/
invCont.buildDetailView = async function (req, res, next) {
    const inv_id = req.params.invid
    const info = await invModel.getInventoryDetails(inv_id)
    const details = await utilities.buildInventoryDetails(info)
    let nav = await utilities.getNav()
    const year = info[0].inv_year
    const make = info[0].inv_make
    const model = info[0].inv_model
    res.render("./inventory/detail", {
        title: year + ' ' + make + ' ' + model,
        nav,
        details,
    })
}

/* **
 * Build an inventory management view
 * **/
invCont.buildManagementView = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
    })
}

/* **
 * Build an add new classification view
 * **/
invCont.buildAddClassificationView = async function (req, res, next) {
    const nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

/* **
 *Add classification process
 * **/
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const newClassResult = await invModel.addClassification(classification_name)

    if (newClassResult) {
        req.flash(
            "notice-success",
            `The ${classification_name} classification was successfully added.`
        )

        const nav = await utilities.getNav()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        req.flash("validation-notice", "Sorry, failed to add new classification.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add New classification",
            nav,
        })
    }
}

/* **
 * Build an add new inventory view
 * **/
invCont.buildAddInventoryView = async function (req, res, next) {
    const list = await utilities.buildClassificationList()
    const nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav: null,
        list,
        errors: null,
    })
}

/* **
 * Add new vehicle process
 * **/
invCont.addNewVehicle = async function (req, res) {
    let nav = await utilities.getNav()
    const { 
        inv_make,  
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    } = req.body

    const newVehicleResult = await invModel.addNewVehicle(
        inv_make,  
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (newVehicleResult) {
        req.flash(
            "notice-success",
            `The ${inv_make} ${inv_model} was successfully added.`
        )

        const nav = await utilities.getNav()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
        })
    } else {
        req.flash("validation-notice", "Sorry, failed to add new vehicle.")
        res.status(501).render("./inventory/add-inventory", {
            title: " ",
            nav: null,
            list,
        })
    }
}

/* **
 * Trigger an intentional 500 error 
 * **/
invCont.intentionalError = async function (req, res, next) {
    try {
        throw new Error("This is an intentional error for testing purposes.")
    } catch (err) {
        next(err)
    }
};
  

module.exports = invCont