const invModel = require("../models/inventory-model");
const Util = {};

/**
 * Error handling middleware wrapper function.
 * This catches errors in async functions and passes them to Express error handlers.
 * @param {Function} fn - The asynchronous route handler function.
 * @returns {Function} - A wrapped function that handles errors.
 */
Util.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  try {
    let data = await invModel.getClassifications();
    console.log(data);
    let list = "<ul>";
    list += '<li><a href="/" title="Return to home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error generating navigation: ", error);
    throw new Error("Unable to generate navigation at this time.");
  }
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  try {
    let grid = "";
    if (data.length > 0) {
      grid = '<ul id="inv-display">';
      data.forEach((vehicle) => {
        grid += "<li>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details"><img src="' +
          vehicle.inv_thumbnail +
          '" alt="Image of ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' on CSE Motors" /></a>';
        grid += '<div class="namePrice">';
        grid += "<hr />";
        grid += "<h2>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details">' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          "</a>";
        grid += "</h2>";
        grid +=
          "<span>$" +
          new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
          "</span>";
        grid += "</div>";
        grid += "</li>";
      });
      grid += "</ul>";
    } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
  } catch (error) {
    console.error("Error building classification grid: ", error);
    throw new Error("Unable to build classification grid at this time.");
  }
};

module.exports = Util;
