const utilities = require("../utilities/");
const { getClassifications } = require("../models/inventory-model");  
const baseController = {};



//Function to build the home page
baseController.buildHome = async function(req, res) {
  try {
    // Fetch classifications from the database
    const classifications = await getClassifications();
    
    // Generate the navigation with the fetched classifications
    const nav = await utilities.getNav(classifications);

    // Render the index page with title and navigation
    res.render("index", { title: "Home", nav });
  } catch (error) {
    console.error("Error building home:", error);
    res.status(500).send("Error generating home page");
  }
};




module.exports = baseController;
