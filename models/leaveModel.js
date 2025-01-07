const db = require('../config/db');

const leaveModel = {
    async holiday(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT count(h.holiday_id) as counts FROM holiday h WHERE h.is_deleted = 0`);
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no,  h.holiday_id, h.holiday_title, DATE_FORMAT(h.holiday_date, '%d-%b-%Y') as holiday_date,
          DATE_FORMAT(h.holiday_date, '%W') AS holiday_day FROM holiday h WHERE h.is_deleted = 0 ${limit}`);
         return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewHoliday(params){

        let [rows] = await db.execute(`SELECT h.holiday_id, h.holiday_title,  h.holiday_date
        FROM holiday h WHERE h.is_deleted = 0 AND h.holiday_id = ?`, [params.holiday_id]);

        return rows;
    },
    async leaveType(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(mlt.m_leave_type_id) AS counts FROM m_leave_type mlt WHERE mlt.is_deleted = 0`);
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, mlt.m_leave_type_id, mlt.leave_type, mlt.no_of_days FROM m_leave_type mlt WHERE mlt.is_deleted = 0 ${limit}`);
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewLeaveType(params){

        let [rows] = await db.execute(`SELECT mlt.m_leave_type_id, mlt.leave_type, mlt.no_of_days
        FROM m_leave_type mlt WHERE mlt.is_deleted = 0 AND mlt.m_leave_type_id = ?`, [params.m_leave_type_id]);

        return rows;
    },
    async leaveRequest(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(lr.leave_id) AS counts FROM leave_requests lr 
        INNER JOIN user_login ul ON ul.user_login_id = lr.user_login_id AND ul.is_deleted = 0 
        LEFT JOIN user_login ul2 ON ul2.user_login_id = lr.approval_by AND ul2.is_deleted = 0
        INNER JOIN m_leave_status mls ON mls.m_leave_status_id = lr.m_leave_status_id AND mls.is_deleted = 0
        INNER JOIN m_leave_type mlt ON mlt.m_leave_type_id = lr.m_leave_type_id AND mlt.is_deleted = 0
        WHERE lr.is_deleted = 0`);

        let sql =`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, lr.leave_id, lr.user_login_id, lr.m_leave_type_id, lr.m_leave_status_id, ul.user_name, 
        mlt.leave_type, mls.leave_status, mls.status_color, DATE_FORMAT(lr.start_date, "%d-%b-%Y") AS start_date,
        DATE_FORMAT(lr.end_date, "%d-%b-%Y") AS end_date, lr.reason,
        lr.approval_by, ul2.user_name AS approval_by_display
        FROM leave_requests lr 
        INNER JOIN user_login ul ON ul.user_login_id = lr.user_login_id AND ul.is_deleted = 0 
        LEFT JOIN user_login ul2 ON ul2.user_login_id = lr.approval_by AND ul2.is_deleted = 0
        INNER JOIN m_leave_status mls ON mls.m_leave_status_id = lr.m_leave_status_id AND mls.is_deleted = 0
        INNER JOIN m_leave_type mlt ON mlt.m_leave_type_id = lr.m_leave_type_id AND mlt.is_deleted = 0
        WHERE lr.is_deleted = 0 ${limit}`;

        let [rows] = await db.execute(sql);
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewLeaveRequest(params){

        let [rows] = await db.execute(`SELECT lr.leave_id, lr.user_login_id, lr.m_leave_type_id, lr.m_leave_status_id,
        DATE_FORMAT(lr.start_date, "%d-%b-%Y") AS start_date,
        DATE_FORMAT(lr.end_date, "%d-%b-%Y") AS end_date, lr.reason,
        lr.approval_by
        FROM leave_requests lr 
        WHERE lr.is_deleted = 0 AND lr.leave_id = ?`, [params.leave_id]);
    
        return rows;
    },
}

module.exports = leaveModel;