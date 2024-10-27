/* ***************************
 * Function to validate the add classification
 * ************************** */
function validateClassificationName(req, res, next) {
  const { classification_name } = req.body;

  // Regex to check for spaces or special characters
  const validNamePattern = /^[a-zA-Z0-9]+$/;

  // Check if classification_name is valid
  if (!validNamePattern.test(classification_name)) {
      req.flash("error", "Invalid classification name. It should not contain spaces or special characters.");
      return res.redirect("/inv/add-classification");
  }

  // If validation passes, proceed to the next middleware or controller
  next();
}

/* ***************************
* Function to validate the add inventory
* ************************** */
function validateInventory(req, res, next) {
  const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
  } = req.body;

  // Check for required fields
  if (!classification_id || !inv_make || !inv_model || !inv_price) {
      req.flash("error", "Please fill in all required fields: classification, make, model, and price.");
      return res.redirect("/inv/add"); // Redirect back to add inventory page
  }

  // Validate price (must be a positive number)
  if (isNaN(inv_price) || inv_price <= 0) {
      req.flash("error", "Price must be a positive number.");
      return res.redirect("/inv/add");
  }

  // Validate year (should be a reasonable number, e.g., not in the future)
  if (isNaN(inv_year) || inv_year < 1886 || inv_year > new Date().getFullYear()) {
      req.flash("error", "Year must be a valid number between 1886 and the current year.");
      return res.redirect("/inv/add");
  }

  // Regex to check for valid vehicle colors (letters and spaces only)
  const validColorPattern = /^[a-zA-Z\s]+$/;
  if (inv_color && !validColorPattern.test(inv_color)) {
      req.flash("error", "Color should only contain letters and spaces.");
      return res.redirect("/inv/add");
  }

  // Proceed to the next middleware or controller if all validations pass
  next();
}

module.exports = {
  validateClassificationName,
  validateInventory
};
