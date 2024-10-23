const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    messages: req.flash("notice"), // Pass flash messages to the view
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav, 
    errors: null,
    messages: req.flash("notice"), 
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    // Set the success flash message
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    
    // Redirect to login page (flash message will be displayed after redirection)
    res.status(201).redirect("/account/login");
  } else {
    // Set the failure flash message
    req.flash("notice", "Sorry, the registration failed.");
    
    // Render the registration page with the failure message
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      messages: req.flash("notice"), // Pass flash messages to the view
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount };
