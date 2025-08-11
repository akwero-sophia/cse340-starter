// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require("../utilities/inventory-validation")
 
//Get inventory for AJAX Route unit 5,select Inv item activity
router.get("/getInventory/:classification_id",utilities.handleErrors(invController.getInventoryJSON))

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to build the inventory details view
router.get("/detail/:invid", invController.buildDetailView)

// Route to build vehicle management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Route to build an add new classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassificationView));

router.post(
    "/add-classification",
    inventoryValidate.addClassificationRules(),
    inventoryValidate.checkAddData,
    utilities.checkAccountType,
    utilities.handleErrors(invController.addClassification)
);

// Route to build an add inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventoryView));

router.post(
    "/add-inventory",
    inventoryValidate.addInventoryRules(),
    inventoryValidate.checkNewVehicleData,
    utilities.checkAccountType,
    utilities.handleErrors(invController.addNewVehicle)
);

router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

// Route to build the edit vehicle information view
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditVehicleInformation))

//Process the information editing
router.post(
    "/update/",
    inventoryValidate.addInventoryRules(),
    inventoryValidate.checkEditVehicleData,
    utilities.checkAccountType,
    utilities.handleErrors(invController.updateInventory)
)

// Route to build the delete confirmation view
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildDeleteView))

// Process the deleting
router.post(
    "/delete/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router