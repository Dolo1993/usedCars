/* ***************************
 * Function to validate the add classification
 * ************************** */
const invModel = require("../models/inventory-model"); 

async function validateClassificationName(req, res, next) {
  const { classification_name } = req.body;

  // Regex to check for spaces or special characters
  const validNamePattern = /^[a-zA-Z0-9]+$/;

  // Check if classification_name is valid
  if (!validNamePattern.test(classification_name)) {
    req.flash("error", "Invalid classification name. It should not contain spaces or special characters.");
    return res.redirect("/inv/add-classification");
  }

  // Check if classification already exists
  const existingClassification = await invModel.getClassificationByName(classification_name);
  if (existingClassification) {
    req.flash("error", "Classification already exists.");
    return res.redirect("/inv/add-classification");
  }

  // If validation passes, proceed to the next middleware or controller
  next();
}

module.exports = {
  validateClassificationName
};
