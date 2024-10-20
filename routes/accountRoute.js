// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to display the login view
router.get("/login", accountController.buildLogin) 


// Route for registration view
router.get('/register', accountController.buildRegister);

// Route to register an account
router.post('/register', utilities.handleErrors(accountController.registerAccount));
 

module.exports = router
