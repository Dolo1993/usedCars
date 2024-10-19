// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to display the login view
router.get("/login", accountController.buildLogin) 


// Route for registration view
router.get('/register', accountController.buildRegister);


// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

module.exports = router
