const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require('../utilities/account-validation');
const invController = require('../controllers/invController');


// Route to get the management page
router.get("/", invController.renderManagementPage);

// Display the login view
router.get("/login", accountController.buildLogin);
 
// Process login data
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);


// Display the registration view
router.get('/register', accountController.buildRegister);

// Process registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
