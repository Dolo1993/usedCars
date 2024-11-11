const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();





/* **********************************
 * Deliver the Login View
 * ********************************* */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const messages = req.flash("notice");
    res.render("account/login", {
      title: "Login",
      nav,
      messages: Array.isArray(messages) ? messages : (messages ? [messages] : []),  
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}




/* **********************************
 * Deliver the Registration View
 * ********************************* */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const messages = req.flash("notice");
    res.render("account/register", {
      title: "Register",
      nav,
      messages: Array.isArray(messages) ? messages : (messages ? [messages] : []),  
      errors: null,
    });
  } catch (error) {
    next(error);
  }
} 




/* **********************************
 * Process Login Request
 * ********************************* */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  // Check if email is provided
  if (!account_email || !account_password) {
    req.flash("notice", "Please enter both email and password.");
    return res.status(400).render("account/login", { title: "Login", nav, errors: [{ msg: "Email and password are required." }] });
  }

  try {
    // Fetch account data from the database by email
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (!accountData) {
      req.flash("notice", "Invalid email or password.");
      return res.status(401).render("account/login", { title: "Login", nav, errors: [{ msg: "Invalid credentials." }] });
    }

    // Compare the hashed password with the one stored in the database
    const isPasswordValid = await bcrypt.compare(account_password, accountData.account_password);
    
    if (isPasswordValid) {
      // Remove password from account data before storing it in the token
      delete accountData.account_password;

      // Generate JWT token with an expiration time of 1 hour
      const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

      // Store the token in a cookie with secure settings
      res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development', maxAge: 3600 * 1000 });

      // Redirect to the inventory management page
      return res.redirect("/inv");
    } else {
      req.flash("notice", "Incorrect email or password.");
      return res.status(401).render("account/login", { title: "Login", nav, errors: [{ msg: "Invalid credentials." }] });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    
    // Send a generic error message for any internal server errors
    res.status(500).send("Internal Server Error");
  }
} 



/* **********************************
 * Process Registration Request
 * ********************************* */
async function registerAccount(req, res, next) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  let nav = await utilities.getNav();

  try {
    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );

    if (result) {
      req.flash("notice", `Registration successful, ${account_firstname}. Please log in.`);
      res.redirect("/account/login");
    } else {
      req.flash("notice", "Registration failed.");
      res.status(500).render("account/register", { title: "Registration", nav });
    }
  } catch (error) {
    next(error);
  }
}




module.exports = {
  buildLogin,
  buildRegister,   
  accountLogin,
  registerAccount
};
