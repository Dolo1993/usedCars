const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
} 


/* ***************************
 *  Build inventory details view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  let nav = await utilities.getNav()
  const vehicle = data[0]  
  res.render("./inventory/details", {
    title: `${vehicle.inv_make} ${vehicle.inv_model} Details`,
    nav,
    vehicle
  })
} 



/* ***************************
 *  Render Inventory Management Page
 * ************************** */

invCont.renderManagementPage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    
    // Retrieve flash messages and pass them to the view
    const messages = req.flash("info") || [];
    
    res.render("inventory/management", {  
      title: "Inventory Management",
      nav,
      messages, // Pass messages to the view
    });
  } catch (error) {
    console.error("Error rendering management page:", error);
    next(error);
  }
};
 


/* ***************************
 * Function to handle form submission
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  try {
    // Check if classification already exists
    const existingClassification = await invModel.getClassificationByName(classification_name);
    if (existingClassification) {
      // Set error flash message
      req.flash("error", "Classification already exists.");
      // Redirect back to the add-classification form
      return res.redirect("/inv/add-classification");
    }

    // Insert classification into the database
    await invModel.insertClassification(classification_name);
    
    // Set success flash message
    req.flash("info", "Classification added successfully.");
    
    // Redirect to management page
    res.redirect("/inv");
  } catch (error) {
    console.error("Error adding classification:", error);
    
    // Set failure flash message
    req.flash("error", "Failed to add classification.");
    
    // Redirect back to the add-classification form
    res.redirect("/inv/add-classification");
  }
};



/* ***************************
 * Render Add Classification Form
 * ************************** */
invCont.renderAddClassificationForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    messages: req.flash("error"), 
  });
}; 



module.exports = invCont;