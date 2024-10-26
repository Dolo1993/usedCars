
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
  
  module.exports = {validateClassificationName};
  