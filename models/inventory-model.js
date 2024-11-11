const pool = require("../database/");




/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  const result = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
  return result; // Return the entire result object
}





/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}





/* ***************************
 *  Get a single vehicle's details by its ID
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`, [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByInvId error: " + error);
  }
}






/* ***************************
 * Function to insert classification into the database
 * ************************** */
async function insertClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("insertClassification error:", error);
    throw error;
  }
}






/* ***************************
 * Check if a classification name already exists in the database
 * ************************** */
async function getClassificationByName(classification_name) {
  try {
    const sql = `SELECT * FROM public.classification WHERE classification_name = $1`;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0]; // Return the classification if it exists
  } catch (error) {
    console.error("getClassificationByName error:", error);
    throw error;
  }
}






/* ***************************
 * Insert new vehicle
 * ************************** */
async function insertVehicle(
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
) {
  const query = `
    INSERT INTO public.inventory (
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
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
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
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("insertVehicle error:", error);
    throw error;
  }
} 






// Function to get inventory form the classification
async function getAllInventory() {
  const result = await pool.query(`
    SELECT i.*, c.classification_name FROM public.inventory AS i
    JOIN public.classification AS c ON i.classification_id = c.classification_id
    ORDER BY i.inv_id
  `);
  return result.rows; 
}






/* ***************************
 * Delete Inventory Item by ID
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql = `DELETE FROM public.inventory WHERE inv_id = $1`;
    await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("deleteInventory error:", error);
    throw error;
  }
}







/* ***************************
 * Update Classification
 * ************************** */
async function updateClassification(classification_id, classification_name) {
  try {
    const sql = `UPDATE public.classification SET classification_name = $1 WHERE classification_id = $2`;
    await pool.query(sql, [classification_name, classification_id]);
  } catch (error) {
    console.error("updateClassification error:", error);
    throw error;
  }
}






/* ***************************
 * Delete Classification
 * ************************** */
async function deleteClassification(classification_id) {
  try {
    const sql = `DELETE FROM public.classification WHERE classification_id = $1`;
    await pool.query(sql, [classification_id]);
  } catch (error) {
    console.error("deleteClassification error:", error);
    throw error;
  }
}





/* ***************************
 * Update Vehicle in Database
 * ************************** */
async function updateVehicle(
  inv_id,
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  inv_image,
  inv_thumbnail
) {
  const query = `
    UPDATE public.inventory 
    SET classification_id = $1, 
        inv_make = $2, 
        inv_model = $3, 
        inv_description = $4, 
        inv_price = $5, 
        inv_year = $6, 
        inv_miles = $7, 
        inv_color = $8,
        inv_image = $9,
        inv_thumbnail = $10
    WHERE inv_id = $11
    RETURNING *;
  `;
  const values = [
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail,
    inv_id
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("updateVehicle error:", error);
    throw error;
  }
}






module.exports = { 
  getClassifications,
  getInventoryByClassificationId, 
  getInventoryByInvId, 
  insertClassification, 
  getClassificationByName,
  insertVehicle,
  getAllInventory,
  deleteInventory,
  updateClassification,  
  deleteClassification,
  updateVehicle
};
