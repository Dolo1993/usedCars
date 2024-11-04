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
    // Directly attempt to insert classification without validation
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
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  // Initialize an array to hold error messages
  const errorMessages = [];

  // Check each required field individually
  if (!classification_id) {
    errorMessages.push("Classification is required.");
  }
  if (!inv_make) {
    errorMessages.push("Make is required.");
  }
  if (!inv_model) {
    errorMessages.push("Model is required.");
  }
  if (!inv_description) {
    errorMessages.push("Description is required.");
  }
  if (!inv_price) {
    errorMessages.push("Price is required.");
  }
  if (!inv_year) {
    errorMessages.push("Year is required.");
  }
  if (!inv_color) {
    errorMessages.push("Color is required.");
  }

  // If there are any error messages, flash them and redirect
  if (errorMessages.length > 0) {
    req.flash("error", errorMessages.join("\n"));
    return res.redirect("/inv/add-inventory");
  }

  try {
    await invModel.insertVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image || "/images/default.jpg",
      inv_thumbnail || "/images/default-thumb.jpg",
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

 // Function to get all inventory items
invCont.renderInventoryList = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const inventoryItems = await invModel.getAllInventory(); 

    res.render("inventory/inventory-list", {
      title: "Inventory List",
      nav,
      inventoryItems,
      messages: req.flash("info") || [],
    });
  } catch (error) {
    console.error("Error rendering inventory list:", error);
    next(error);
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
    req.flash("info", "Item deleted successfully.");
    res.redirect("/inv/list");
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    req.flash("error", "Failed to delete item.");
    res.redirect("/inv/list");
  }
};


module.exports = invCont;
