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
    res.render("inventory/management", {  
      title: "Inventory Management",
      nav,
      messages: [], 
    });
  } catch (error) {
    console.error("Error rendering management page:", error);
    next(error);
  }
};

module.exports = invCont