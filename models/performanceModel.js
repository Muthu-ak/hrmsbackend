const db = require('../config/db');

const performanceModel = {
    async appraisalCycleList({isExcel, limit, orderBY , where}){
        let _result = {};

        let excel_not_include_fields = "";

        if(!isExcel){
            excel_not_include_fields = `ac.appraisal_cycle_id, ac.appraisal_status_id, 
            CONCAT(DATE_FORMAT(ac.start_date, "%d-%b-%Y") , " to ", DATE_FORMAT(ac.end_date, "%d-%b-%Y")) AS appraisal_date, `;
            let [count] = await db.execute(`SELECT COUNT(ac.appraisal_cycle_id) AS counts FROM appraisal_cycle ac WHERE ac.is_deleted = 0 ${where}`);
            _result['totalRecord'] = count[0]['counts'];
        }

        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, 
        ${excel_not_include_fields} ac.appraisal_name, 
        DATE_FORMAT(ac.start_date, "%d-%b-%Y") AS start_date,
        DATE_FORMAT(ac.end_date, "%d-%b-%Y") AS end_date,
        (CASE WHEN ac.appraisal_status_id = 1 THEN "Start" 
        WHEN ac.appraisal_status_id = 2 THEN "Inprogress" 
        WHEN ac.appraisal_status_id = 3 THEN "Completed" END) AS appraisal_status,
        is_active
        FROM appraisal_cycle ac WHERE ac.is_deleted = 0 ${where} ${limit}`);

        _result['data'] = rows;

        return _result;
    },
    async competency({isExcel, limit, orderBY , where}){
        let _result = {};

        let excel_not_include_fields = "";

        if(!isExcel){
            excel_not_include_fields = `com.compentency_id, `;
            let [count] = await db.execute(`SELECT COUNT(com.compentency_id) AS counts FROM compentency com WHERE com.is_deleted = 0 ${where}`);
            _result['totalRecord'] = count[0]['counts'];
        }

        let sql = `SELECT ROW_NUMBER() OVER(${orderBY}) as s_no,  ${excel_not_include_fields} 
        com.compentency_name, com.weightage FROM compentency com WHERE com.is_deleted = 0  ${where} ${limit}`;
    
        let [rows] = await db.execute(sql);

        _result['data'] = rows;

        return _result;
    },
    async questions(req){

        const {appraisal_cycle_id, user_login_id} = req.query;

        let sql = `SELECT ROW_NUMBER() OVER(ORDER BY com.created_by) as s_no, com.compentency_id,
        com.compentency_name, com.weightage, sa.self_appraisal_id, sa.user_rating, 
        sa.user_comment, sa.reviewer_rating, sa.reviewer_comment FROM compentency com 
        LEFT JOIN self_appraisal sa ON sa.compentency_id = com.compentency_id AND sa.is_deleted = 0 
        AND sa.appraisal_cycle_id = ${appraisal_cycle_id} AND sa.user_login_id = ${user_login_id} WHERE com.is_deleted = 0`;

        let [rows] = await db.execute(sql);

        return rows;
    },
    async appraiseelist({isExcel, limit, orderBY , where}){
        let _result = {};

        let excel_not_include_fields = "";

        const joins = `INNER JOIN employees e ON e.user_login_id = al.user_login_id AND e.is_deleted = 0
        INNER JOIN user_login ul ON ul.user_login_id = al.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
        LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        LEFT JOIN user_login ul2 ON ul2.user_login_id = e.reporting_id AND mdn.is_deleted = 0`;

        if(!isExcel){
            excel_not_include_fields = `al.appraisee_id, al.appraisal_cycle_id, al.user_login_id, `;
            let [count] = await db.execute(`SELECT COUNT(al.appraisee_id) AS counts FROM appraisee_list al ${joins} WHERE al.is_deleted = 0 ${where}`);
            _result['totalRecord'] = count[0]['counts'];
        }

        const sql = `SELECT ROW_NUMBER() OVER(${orderBY}) as s_no,  ${excel_not_include_fields} 
        al.overall_score, al.self_score, ul.user_name, mut.user_type, mdn.designation_name, md.department_name, 
        (CASE WHEN al.status_id = 1 THEN "Start" 
        WHEN al.status_id = 2 THEN "Self Reviewed" 
        WHEN al.status_id = 3 THEN "Completed" END) AS status,
        ul2.user_name AS reviewer_name FROM appraisee_list al 
        ${joins} WHERE al.is_deleted = 0 ${where} ${limit}`;

        let [rows] = await db.execute(sql);

        _result['data'] = rows;

        return _result;
    },
    async viewAppraisee(req){

        const {appraisal_cycle_id, user_login_id} = req.query;

        const sql = `SELECT al.appraisee_id, al.appraisal_cycle_id, al.user_login_id, al.overall_score, al.self_score, al.status_id, ac.is_publish,
        e.emp_code, DATE_FORMAT(e.date_of_joining, '%d-%b-%Y') AS date_of_joining, ul2.user_name AS reviewer_name, e.reporting_id,
        (CASE WHEN al.status_id = 1 THEN "Start" 
                WHEN al.status_id = 2 THEN "Self Reviewed" 
                WHEN al.status_id = 3 THEN "Completed" END) AS status, ac.appraisal_name, ac.is_active, 
        CONCAT(DATE_FORMAT(ac.start_date, '%b-%Y'), ' to ', DATE_FORMAT(ac.end_date, '%b-%Y')) AS appraisal_cycle_dates, 
        ul.user_name, mut.user_type, md.department_name, mdn.designation_name FROM appraisee_list al 
        LEFT JOIN appraisal_cycle ac ON ac.appraisal_cycle_id = al.appraisal_cycle_id AND ac.is_deleted = 0
        INNER JOIN employees e ON e.user_login_id = al.user_login_id AND e.is_deleted = 0
        INNER JOIN user_login ul ON ul.user_login_id = al.user_login_id AND ul.is_deleted = 0
        INNER JOIN m_user_type mut ON mut.m_user_type_id = ul.m_user_type_id AND mut.is_deleted = 0
        LEFT JOIN m_designation mdn ON mdn.m_designation_id = e.m_designation_id AND mdn.is_deleted = 0
        LEFT JOIN m_departments md ON md.m_department_id = e.m_department_id AND md.is_deleted = 0
        LEFT JOIN user_login ul2 ON ul2.user_login_id = e.reporting_id AND ul2.is_deleted = 0

        WHERE al.is_deleted = 0 AND al.appraisal_cycle_id = ${appraisal_cycle_id} AND al.user_login_id = ${user_login_id}`;

        let [rows] = await db.execute(sql);

        return rows;
    },
}

module.exports = performanceModel;