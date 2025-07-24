const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
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

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invid
  const info = await invModel.getInventoryByInvId(inv_id)
  const details = await utilities.buildInventoryDetails(info)
  let nav = await utilities.getNav()
  console.log("Information:", info);
  const year = info[0].inv_year
  const make = info[0].inv_make
  const model = info[0].inv_model
  res.render("./inventory/detail", {
    title: year + " " + make + " " + model,
    nav,
    details,
  })
}

module.exports = invCont