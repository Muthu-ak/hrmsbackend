
const db = require('../config/db');
const adodb = require('../adodb');

const userModel = {
  // Get all users
  async getUserList() {
    const x = await adodb.insertSql();
    console.log(x);
    return x;
  },

  // Get user by ID
  async getUserById(userId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    return rows[0];
  },

  // Create a new user
  async createUser(userData) {
    const { name, email, password } = userData;
    const result = await db.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result[0];
  },

  // Update a user
  async updateUser(userId, userData) {
    const { name, email, password } = userData;
    const result = await db.execute(
      'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
      [name, email, password, userId]
    );
    return result[0];
  },

  async deleteUser(userId) {
    const result = await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    return result[0];
  }

}

// Export functions
module.exports = userModel;
