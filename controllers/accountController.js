const accountModel = require("../models/account-model");
const utilities = require("../utilities/");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"), 
      errors: null,
    });
  } catch (error) {
    next(error); 
  }
}

/* ****************************************
 *  Process login
 * *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  try {
    const accountData = await accountModel.getAccountByEmail(account_email);

    if (accountData && await accountModel.comparePassword(account_password, accountData.account_password)) {
      req.flash("notice", `Welcome back, ${accountData.account_firstname}.`);
      res.redirect("/account/dashboard");
    } else {
      req.flash("notice", "Incorrect email or password. Please try again.");
      res.status(401).render("account/login", {
        title: "Login",
        nav,
        messages: req.flash("notice"),
        errors: [{ msg: "Incorrect email or password." }]
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    req.flash("notice", "Login failed due to an internal error.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash("notice"),
      errors: [{ msg: "Login failed due to an internal error." }]
    });
  }
}


/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav, 
      errors: null,
      messages: req.flash("notice"), 
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res, next) {
  try {
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
        `Congratulations, you're registered ${account_firstname}. Please log in.`
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
        messages: req.flash("notice"), 
      });
    }
  } catch (error) {
    next(error); 
  }
}

module.exports = { buildLogin, buildRegister, loginAccount, registerAccount };
