const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")    

const { validateClassificationName } = require("../utilities/inventory-validation"); // Check the path here

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId); 

// Route for individual vehicle details
router.get("/detail/:invId", invController.buildByInvId) 


// Route to render the management page
router.get("/", invController.renderManagementPage);


// Route to render the Add Classification form
router.get("/add-classification", invController.renderAddClassificationForm);

// Route to handle form submission with validation middleware
router.post("/add-classification", validateClassificationName, invController.addClassification);

module.exports = router;