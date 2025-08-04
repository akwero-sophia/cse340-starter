// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
 
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build an add new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to build an add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

module.exports = router