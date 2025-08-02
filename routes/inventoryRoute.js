// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to handle intentional 500 error
router.get("/error", invController.intentionalError);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:invid", invController.buildDetailView);

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build an add new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to build an add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

//Process the classification addition
router.post(
    "/add-classification", 
    invValidate.addClassificationRules(),
    invValidate.checkAddData,
    utilities.handleErrors(invController.addClassification));

router.post(
    "/add-inventory",
    invValidate.addInventoryRules(),
    invValidate.checkNewVehicleData,
    utilities.handleErrors(invController.addNewVehicle));


module.exports = router