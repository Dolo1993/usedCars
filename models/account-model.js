const pool = require("../database/index.js");
const bcrypt = require("bcrypt");




/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10); // Hash the password
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword]);
    
    return result.rows[0]; // Return the newly created account
  } catch (error) {
    console.error("Error registering account:", error);
    throw new Error("Registration failed"); 
  }
}




/* *****************************
*   Check if email exists
* *************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    
    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking existing email:", error); 
    throw new Error("Failed to check existing email"); 
  }
} 



/* *****************************
*   Get account by email
* *************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    
    return result.rows[0]; 
  } catch (error) {
    console.error("Error fetching account by email:", error); 
    throw new Error("Failed to retrieve account by email"); 
  }
} 




/* *****************************
*   Compare password
* *************************** */
async function comparePassword(plainTextPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword); 
  } catch (error) {
    console.error("Error comparing passwords:", error); 
    throw new Error("Password comparison failed");
  }
} 




module.exports = { registerAccount, getAccountByEmail, comparePassword, checkExistingEmail }; 
