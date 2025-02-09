const db = require('../config/db');

const attendanceModel = {
    async attendance(pagesize, offset, orderBY, where){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;
     
        let [count] = await db.execute(`SELECT COUNT(att.attendance_id) AS counts FROM attendance att 
        INNER JOIN user_login ul ON ul.user_login_id = att.user_login_id AND ul.is_deleted = 0 
        WHERE att.is_deleted = 0 ${where}`);

        let sql = `SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, att.attendance_id, att.user_login_id, ul.user_name, 
        DATE_FORMAT(att.punch_in, '%h:%i %p') AS punch_in, DATE_FORMAT(att.punch_out, '%h:%i %p') AS punch_out, 
        DATE_FORMAT(att.attendance_date, "%d-%b-%Y") AS attendance_date, TIMEDIFF(att.punch_out, att.punch_in) AS working_hours,
        att.m_attendance_status_id , mas.attendance_status FROM attendance att
        INNER JOIN user_login ul ON ul.user_login_id = att.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_attendance_status mas ON mas.m_attendance_status_id = att.m_attendance_status_id AND mas.is_deleted = 0
        WHERE att.is_deleted = 0 ${where}  ${limit}`;
   
        let [rows] = await db.execute(sql);
      
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewAttendance(params){

        let [rows] = await db.execute(`SELECT att.attendance_id, att.user_login_id, 
        DATE_FORMAT(att.punch_in, '%H:%i') AS punch_in, 
        DATE_FORMAT(att.punch_out, '%H:%i') AS punch_out, 
        DATE_FORMAT(att.attendance_date, "%d-%b-%Y") AS attendance_date, 
        att.m_attendance_status_id FROM attendance att
        INNER JOIN user_login ul ON ul.user_login_id = att.user_login_id AND ul.is_deleted = 0
        WHERE att.is_deleted = 0 AND att.attendance_id = ?`, [params.attendance_id]);

        return rows;
    },
    async attendanceReport({isExcel, limit, orderBY , where, joinWhere, daysQuery}){
        let _result = {};

        let excel_not_include_fields = "";

        const joins = `INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0 
        LEFT JOIN attendance a ON a.user_login_id = ul.user_login_id AND a.is_deleted = 0 ${joinWhere} `;

        if(!isExcel){
            excel_not_include_fields = "ul.user_login_id,";
            let [count] = await db.execute(`SELECT count(ul.user_login_id) as counts FROM user_login ul ${joins} WHERE ul.is_deleted = 0 AND ul.m_user_type_id != 1000 ${where} GROUP BY ul.user_login_id`);
            _result['totalRecord'] = count[0]['counts'];
        }

        const sql = `SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, ${excel_not_include_fields}  
        ul.user_name, mut.user_type, ${daysQuery}
        FROM user_login ul ${joins}
        WHERE ul.is_deleted = 0 AND ul.m_user_type_id != 1000 ${where}
        GROUP BY ul.user_login_id ${limit}`;
     
        let [rows] = await db.execute(sql);

        _result['data'] = rows;

        return _result;
    },
}

module.exports = attendanceModel;