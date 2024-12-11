
const db = require('../config/db');

const userModel = {

  async getUserList() {
    const [rows] = await db.query("SELECT ul.user_login_id, ul.user_name, ul.email_id, ul.m_user_type_id FROM user_login ul WHERE ul.is_deleted = 0");
    return rows;
  },

}

// Export functions
module.exports = userModel;
