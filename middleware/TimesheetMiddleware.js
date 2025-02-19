const db = require("../config/db");
const moment = require("moment");

const createTaskDuration = async(req, res, next) =>{

    if(!req.body.hasOwnProperty('is_deleted')){

        let {project_member_id, start_date_time, end_date_time, project_id} = req.body;

        const d1 = moment(start_date_time).format("YYYY-MM-DD HH:mm:ss");
        const d2 = moment(end_date_time).format("YYYY-MM-DD HH:mm:ss");

        let sql = `SELECT ul.user_name, (SELECT 
	    SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(IF(DATE('${d2}') = att.attendance_date, TIME('${d2}'),  IF(att.punch_out IS NULL, c.end_time, att.punch_out)), 
		IF(DATE('${d1}') = att.attendance_date, TIME('${d1}'),  att.punch_in))))) 
        FROM attendance att JOIN company c
        WHERE att.is_deleted = 0 AND att.user_login_id = ul.user_login_id 
        AND att.attendance_date BETWEEN DATE('${d1}') AND DATE('${d2}') AND att.m_attendance_status_id IN (1,2) ) AS task_duration  
        FROM project_members pm 
        INNER JOIN user_login ul ON ul.user_login_id = pm.user_login_id AND ul.is_deleted = 0
        WHERE pm.is_deleted = 0 AND  pm.project_member_id = ${project_member_id} AND pm.project_id = ${project_id} `;
            
        let [rows] = await db.execute(sql);
    
        if(rows.length > 0 && rows[0]['task_duration'] == null){
            return res.status(400).json({'msg': `${rows[0]['user_name']} is not punch in these days.`});
        }
        else{
            req.body['task_duration'] = rows[0]['task_duration'];
            next();
        }
    }
    else{
        next();
    }
}

module.exports = createTaskDuration;