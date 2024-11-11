const pool = require("../database/index");
const bcrypt = require("bcrypt");



async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Registration failed");
  }
}

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query("SELECT * FROM account WHERE account_email = $1", [account_email]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Failed to retrieve account by email");
  }
}

async function comparePassword(plainTextPassword, hashedPassword) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}

module.exports = { registerAccount, getAccountByEmail, comparePassword };
