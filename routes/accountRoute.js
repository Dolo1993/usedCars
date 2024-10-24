const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require('../utilities/account-validation');



// Route to display the login view
router.get("/login", accountController.buildLogin);


// Process the login data
router.post("/login", utilities.handleErrors(accountController.loginAccount));


// Route for registration view
router.get('/register', accountController.buildRegister);


// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
); 



module.exports = router;
