const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {}; 




/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name || "Unknown";
  
  res.render("./inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  });
}; 




/* ***************************
 *  Build inventory details view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  let nav = await utilities.getNav();
  const vehicle = data[0];

  res.render("./inventory/details", {
    title: `${vehicle.inv_make} ${vehicle.inv_model} Details`,
    nav,
    vehicle,
  });
};





/* ***************************
 *  Render Inventory Management Page
 * ************************** */
invCont.renderManagementPage = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const messages = req.flash("info") || [];

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages,
    });
  } catch (error) {
    console.error("Error rendering management page:", error);
    next(error);
  }
};






/* ***************************
 * Function to handle form submission for adding classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  try {
    await invModel.insertClassification(classification_name);
    req.flash("info", "Classification added successfully.");
    res.redirect("/inv");
  } catch (error) {
    console.error("Error adding classification:", error);
    req.flash("error", "Failed to add classification.");
    res.redirect("/inv/add-classification");
  }
};





/* ***************************
 * Render Add Classification Form with existing classifications
 * ************************** */
invCont.renderAddClassificationForm = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classifications = await invModel.getClassifications();
    const messages = req.flash("info").concat(req.flash("error"));  
    
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages, // Pass messages to the view
      classifications: classifications.rows, // Pass classifications to the view
    });
  } catch (error) {
    console.error("Error rendering add classification form:", error);
    next(error);
  }
};





/* ***************************
 * Handle Update Classification
 * ************************** */
invCont.updateClassification = async function (req, res, next) {
  const { classification_id, classification_name } = req.body;
  
  try {
    await invModel.updateClassification(classification_id, classification_name);
    req.flash("info", "Classification updated successfully.");
    res.redirect("/inv/add-classification");
  } catch (error) {
    console.error("Error updating classification:", error);
    req.flash("error", "Failed to update classification.");
    res.redirect("/inv/add-classification");
  }
}; 






/* ***************************
 * Delete Classification
 * ************************** */
invCont.deleteClassification = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  
  try {
    await invModel.deleteClassification(classification_id);
    req.flash("info", "Classification deleted successfully.");
    res.redirect("/inv/add-classification");
  } catch (error) {
    console.error("Error deleting classification:", error);
    req.flash("error", "Failed! Please delete all the inventory item in that classification");
    res.redirect("/inv/add-classification");
  }
};





/* ***************************
 * Render Add Vehicle Form
 * ************************** */
invCont.renderAddVehicleForm = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classifications = await invModel.getClassifications();
  
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle to Inventory",
    nav,
    classifications: classifications.rows,
    formData: req.body || {},
    errorMsg: req.flash("error"),
  });
};





/* ***************************
 * Handle Add Vehicle Submission
 * ************************** */
invCont.addVehicle = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;

  const errorMessages = [];

  if (!classification_id) errorMessages.push("Classification is required.");
  if (!inv_make) errorMessages.push("Make is required.");
  if (!inv_model) errorMessages.push("Model is required.");
  if (!inv_description) errorMessages.push("Description is required.");
  if (!inv_price) errorMessages.push("Price is required.");
  if (!inv_year) errorMessages.push("Year is required.");
  if (!inv_color) errorMessages.push("Color is required.");

  if (errorMessages.length > 0) {
    req.flash("error", errorMessages.join("\n"));
    return res.redirect("/inv/add-inventory");
  }

  try {
    const inv_image = req.files?.inv_image ? `/images/vehicles/${req.files.inv_image[0].filename}` : "/images/default.jpg";
    const inv_thumbnail = req.files?.inv_thumbnail ? `/images/vehicles/${req.files.inv_thumbnail[0].filename}` : "/images/default-thumb.jpg";

    await invModel.insertVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles || 0,
      inv_color
    );

    req.flash("info", "Vehicle added successfully.");
    res.redirect("/inv");
  } catch (error) {
    console.error("Error adding vehicle:", error);
    req.flash("error", "Failed to add vehicle.");
    res.redirect("/inv/add-inventory");
  }
};





// Function to get all inventory items with optional search
invCont.renderInventoryList = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const inventoryItems = await invModel.getAllInventory(); 
    
    // Get the search query from the request
    const searchQuery = req.query.search ? req.query.search.toLowerCase() : '';
    
    // Filter inventory items based on search query
    const filteredItems = inventoryItems.filter(item => 
      item.inv_make.toLowerCase().includes(searchQuery) || 
      item.inv_model.toLowerCase().includes(searchQuery)
    );

    res.render("inventory/inventory-list", {
      title: "Inventory List",
      nav,
      inventoryItems: filteredItems,
      messages: req.flash("info") || [],
      searchQuery // Pass search query to the view
    });
  } catch (error) {
    console.error("Error rendering inventory list:", error);
    next(error);
  }
};





/* ***************************
 * Confirm Deletion of an Inventory Item
 * ************************** */
invCont.confirmDelete = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    // Fetch item details to display in the confirmation message
    const item = await invModel.getInventoryByInvId(inv_id);
    let nav = await utilities.getNav();
    
    // Render the confirmation page with the item details
    res.render("inventory/confirm-delete", {
      title: "Confirm Deletion",
      nav,
      item: item[0],  // Pass the item details to the view
    });
  } catch (error) {
    console.error("Error rendering delete confirmation:", error);
    next(error);
  }
};





/* ***************************
 * Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    await invModel.deleteInventory(inv_id); // Call model to delete item
    req.flash("info", "Inventory deleted successfully.");
    res.redirect("/inv/list");
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    req.flash("error", "Failed to delete item.");
    res.redirect("/inv/list");
  }
};




/* ***************************
 * Render Edit Inventory Form
 * ************************** */
invCont.renderEditInventoryForm = async function (req, res, next) {
  const inv_id = req.params.invId;
  try {
    let nav = await utilities.getNav();
    const item = await invModel.getInventoryByInvId(inv_id);
    const classifications = await invModel.getClassifications();

    if (!item || item.length === 0) {
      req.flash("error", "Inventory item not found.");
      return res.redirect("/inv");
    }

    res.render("inventory/edit-inventory", {
      title: "Edit Inventory Item",
      nav,
      item: item[0],  // Pass the inventory item details to the view
      classifications: classifications.rows,
      successMsg: req.flash("success"),
      errorMsg: req.flash("error")
    });
  } catch (error) {
    console.error("Error rendering edit inventory form:", error);
    next(error);
  }
}; 





/* ***************************
 * Handle Update Inventory Submission
 * ************************** */
invCont.updateInventoryItem = async function (req, res, next) {
  const inv_id = req.params.invId;
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    existing_image,
    existing_thumbnail
  } = req.body;

  // Check if new images were uploaded, otherwise use existing paths
  const inv_image = req.files['inv_image'] ? `/images/vehicles/${req.files['inv_image'][0].filename}` : existing_image;
  const inv_thumbnail = req.files['inv_thumbnail'] ? `/images/vehicles/${req.files['inv_thumbnail'][0].filename}` : existing_thumbnail;

  try {
    await invModel.updateVehicle(
      inv_id,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_price,
      inv_year,
      inv_miles || 0,
      inv_color,
      inv_image,
      inv_thumbnail
    );

    req.flash("success", "Inventory item updated successfully.");
    res.redirect(`/inv/edit/${inv_id}`);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    req.flash("error", "Failed to update inventory item.");
    res.redirect(`/inv/edit/${inv_id}`);
  }
};




module.exports = invCont;
