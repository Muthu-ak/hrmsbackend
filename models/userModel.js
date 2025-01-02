
const db = require('../config/db');

const userModel = {

  async getUserList(pagesize, offset, orderBY, where) {

    let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

    const [count] = await db.query(`SELECT count(e.employee_id) as counts FROM employees e 
    INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
    INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
    LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
    LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted =0 
    WHERE e.is_deleted = 0 ${where}`);

    const [rows] = await db.query(`SELECT ROW_NUMBER() OVER(${orderBY}) AS s_no, e.employee_id, ul.user_login_id, ul.user_name, ul.email_id, mut.user_type,  
    e.phone_number, md.department_name, mdn.designation_name FROM employees e 
    INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
    INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
    LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
    LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted =0 
    WHERE e.is_deleted = 0 ${where} ${limit}`);
    return {data:rows, totalRecord:count[0]['counts']};
  },

  async experience(user_login_id) {
    const [rows] = await db.query(`SELECT ROW_NUMBER() OVER(ORDER BY ee.end_date DESC) AS s_no, ee.employee_experience_id,
    ee.previous_job_title,ee.previous_company_name,  ee.previous_job_location,
    DATE_FORMAT(ee.start_date, "%d-%b-%Y") AS start_date, DATE_FORMAT(ee.end_date, "%d-%b-%Y") AS end_date 
    FROM employee_experience ee 
    WHERE ee.is_deleted = 0 AND ee.user_login_id = ?`,[user_login_id]);
    return rows;
  },

  async documents(user_login_id, employee_document_id = null) {
    let where = ''; 

    if(employee_document_id != null){
      where = ` AND ed.employee_document_id = ${employee_document_id}`;
    }

    const [rows] = await db.query(`SELECT ROW_NUMBER() OVER(ORDER BY ed.created_on DESC) AS s_no, ed.employee_document_id, ed.user_login_id, ed.document_id, ed.file_name 
    FROM employee_document ed  WHERE ed.is_deleted = 0 AND ed.user_login_id = ? ${where}`,[user_login_id]);
    return rows;
  },

  async salary(user_login_id) {
    const [rows] = await db.query(`SELECT es.employee_salary_id, es.user_login_id, es.basic_salary, es.house_rent_allowance, es.medical_allowance,
    es.transport_allowance, es.other_allowance, es.tax, es.other_deduction FROM  employee_salary es WHERE es.is_deleted = 0 AND es.user_login_id = ?`,[user_login_id]);
    return rows;
  },

}

// Export functions
module.exports = userModel;
