// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require("../utilities/inventory-validation")
 
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to build the inventory details view
router.get("/detail/:invid", invController.buildDetailView)

// Route to build vehicle management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build an add new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

router.post(
    "/add-classification",
    inventoryValidate.addClassificationRules(),
    inventoryValidate.checkAddData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build an add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

router.post(
    "/add-inventory",
    inventoryValidate.addInventoryRules(),
    inventoryValidate.checkNewVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
);


module.exports = router