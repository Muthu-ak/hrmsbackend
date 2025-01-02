const db = require('../config/db');

const dashboardModel = {
    async notice(){
        let [rows] = await db.execute(`SELECT n.notice_id, n.notice_title, n.notice_content, DATE_FORMAT(n.issue_date, "%d-%b-%Y") AS issue_date_display , n.issue_date, n.notice_status
        FROM notice n WHERE n.is_deleted = 0 AND n.notice_status = 1 ORDER BY n.issue_date DESC LIMIT 5`);
        return rows;
    },
    async upcomingHolidays(){
        let [rows] = await db.execute(`SELECT h.holiday_id, h.holiday_title, DATE_FORMAT(h.holiday_date, "%d-%b-%Y") AS holiday_date, DATE_FORMAT(h.holiday_date, "%W") AS holiday_day FROM holiday h WHERE h.is_deleted = 0 ORDER BY h.holiday_date ASC LIMIT 5`);
        return rows;
    },
    async todayBirthday(){
        let [rows] = await db.execute(`SELECT e.employee_id, ul.user_login_id, ul.user_name, md.department_name, mdn.designation_name, 
        DATE_FORMAT(e.date_of_birth, "%d-%b-%Y") AS date_of_birth,
        (YEAR(NOW()) - YEAR(e.date_of_birth)) AS age FROM employees e 
        INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        INNER JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        WHERE e.is_deleted = 0 AND e.m_employee_status_id = 1 AND DATE_FORMAT(e.date_of_birth , "%m-%d") = DATE_FORMAT(NOW(), "%m-%d")`);
        return rows;
    },
    async newHires(){
        let [rows] = await db.execute(`SELECT e.employee_id, ul.user_login_id, ul.user_name, md.department_name, mdn.designation_name,
        DATE_FORMAT(e.date_of_joining, "%d-%b-%Y") AS date_of_joining FROM employees e 
        INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        INNER JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        WHERE e.is_deleted = 0 AND e.m_employee_status_id = 1 AND e.date_of_joining BETWEEN  DATE(DATE_SUB(NOW(), INTERVAL 30 DAY)) AND DATE(NOW()) 
        ORDER BY e.date_of_joining DESC`);
        return rows;
    },
    async workAnniversary(){
        let [rows] = await db.execute(`SELECT e.employee_id, ul.user_login_id, ul.user_name, md.department_name, mdn.designation_name, 
        DATE_FORMAT(e.date_of_joining, "%d-%b-%y")  AS date_of_joining,
        (YEAR(NOW()) - YEAR(e.date_of_joining)) AS anniversary_year  
        FROM employees e 
        INNER JOIN user_login ul ON ul.user_login_id = e.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        INNER JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        WHERE e.is_deleted = 0 AND e.m_employee_status_id = 1 
        AND DATE_FORMAT(e.date_of_joining, "%d-%m") = DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 7 day), "%d-%m")
        AND YEAR(e.date_of_joining) <> YEAR(NOW())
        ORDER BY e.date_of_joining DESC`);
        return rows;
    },
    async hrCards(){
        let [rows] = await db.execute(`SELECT COUNT(e.employee_id) AS overall_employees,
        (SELECT COUNT(CASE WHEN ul.m_user_type_id = 20 THEN ul.user_login_id END) AS counts FROM user_login ul 
        WHERE ul.is_deleted = 0) AS total_managers,
        (SELECT COUNT(CASE WHEN ul.m_user_type_id = 1 THEN ul.user_login_id END) AS counts FROM user_login ul 
        WHERE ul.is_deleted = 0) AS total_employees,
        (SELECT COUNT(c.client_id) AS counts FROM clients c WHERE c.is_deleted = 0) AS total_clients,
        (SELECT COUNT(pt.project_id) AS counts FROM projects pt WHERE pt.is_deleted = 0) AS total_projects
        FROM employees e WHERE e.is_deleted = 0`);
        return rows;
    },
}

module.exports = dashboardModel;