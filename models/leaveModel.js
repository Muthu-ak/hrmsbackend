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
}

module.exports = leaveModel;