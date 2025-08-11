const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      const error = new Error("Vehicle classification not found");
      error.status = 404;
      throw error;
    }

    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};


/* **
 * Build inventory detail view
 * **/
invCont.buildDetailView = async function (req, res, next) {
    const inv_id = req.params.invid
    const vehicle = await invModel.getDetailByVehicleId(inv_id)
    const details = await utilities.buildInventoryDetails([vehicle])
    let nav = await utilities.getNav()
    const year = vehicle.inv_year
    const make = vehicle.inv_make
    const model = vehicle.inv_model
    res.render("./inventory/detail", {
        title: year + ' ' + make + ' ' + model,
        nav,
        details,
    })
}

/* ********************
 *Build vehicle management view
 * *******************/
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        list: classificationSelect,
        errors: null,
    })
}

/* ********************
 *Build add classification view
 * *******************/
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

// add classification process
invCont.addClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body

    const newClassResult = await invModel.addClassification(classification_name)

    if (newClassResult) {
        req.flash(
            "notice",
            `The ${classification_name} classification was successfully added.`
        )

        const nav = await utilities.getNav()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, failed to add new classification.")
        res.status(501).render("./inventory/add-classification", {
            title: "Add New classification",
            nav,
        })
    }
}

//build add inventory view
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
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        )

        const nav = await utilities.getNav()
        const list = await utilities.buildClassificationList()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            list,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, failed to add new vehicle.")
        res.status(501).render("./inventory/add-inventory", {
            title: " ",
            nav: null,
            list,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* **
 * Build an add edit vehicle information view
 * **/
invCont.buildEditVehicleInformation = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const inventoryData = await invModel.getDetailByVehicleId(inv_id)
    const list = await utilities.buildClassificationList(inventoryData.classification_id)
    const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        list: list,
        errors: null,
        inv_id: inventoryData.inv_id,
        inv_make: inventoryData.inv_make,
        inv_model: inventoryData.inv_model,
        inv_year: inventoryData.inv_year,
        inv_description: inventoryData.inv_description,
        inv_image: inventoryData.inv_image,
        inv_thumbnail: inventoryData.inv_thumbnail,
        inv_price: inventoryData.inv_price,
        inv_miles: inventoryData.inv_miles,
        inv_color: inventoryData.inv_color,
        classificationId: inventoryData.classification_id
    })
}

/* **
 * Edit vehicle information process
 * **/
invCont.updateInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const { 
        inv_id,
        inv_make,  
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
        inv_id,
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

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash(
            "notice",
            `The ${itemName} was successfully updated.`
        )
        res.redirect("/inv/")
    } else {
        const list = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("./inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            list: list,
            errors: null,
            inv_id,
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
        })
    }
}

/* **
 * Build a delete vehicle confirmation view
 * **/
invCont.buildDeleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    const nav = await utilities.getNav()
    const inventoryData = await invModel.getDetailByVehicleId(inv_id)
    const itemName = `${inventoryData.inv_make} ${inventoryData.inv_model}`
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: inventoryData.inv_id,
        inv_make: inventoryData.inv_make,
        inv_model: inventoryData.inv_model,
        inv_year: inventoryData.inv_year,
        inv_price: inventoryData.inv_price,
    })
}

/* **
 * Delete vehicle information process
 * **/
invCont.deleteInventory = async function (req, res) {
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
        req.flash(
            "notice",
            'The deletion was successful.'
        )
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.redirect("/inv/delete/inv_id") 
    }
}

module.exports = invCont