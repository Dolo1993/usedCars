// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")   

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId); 

// Route for individual vehicle details
router.get("/detail/:invId", invController.buildByInvId) 


// Route to render the management page
router.get("/management", invController.renderManagementPage);


module.exports = router;