
const db = require('../config/db');

const userModel = {

  async getUserList(pagesize, offset) {

    let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

    const [count] = await db.query(`SELECT count(e.employee_id) as counts FROM employees e 
    INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
    INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
    LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
    LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted =0 
    WHERE e.is_deleted = 0`);

    const [rows] = await db.query(`SELECT ROW_NUMBER() OVER(ORDER BY e.created_on DESC) AS s_no, e.employee_id, ul.user_login_id, ul.user_name, ul.email_id, mut.user_type,  
    e.phone_number, md.department_name, mdn.designation_name FROM employees e 
    INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
    INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
    LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
    LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted =0 
    WHERE e.is_deleted = 0 ORDER BY e.created_on DESC ${limit}`);
    return {data:rows, totalRecord:count[0]['counts']};
  },

}

// Export functions
module.exports = userModel;
