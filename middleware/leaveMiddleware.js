const db = require("../config/db");
const moment = require("moment");

const getNofLeaveDaysExecute = async(start_date, end_date) =>{

    let sd = moment(start_date).format("YYYY-MM-DD");
    let ed = moment(end_date).format("YYYY-MM-DD");

    let loop = new Date(start_date);
    const end = new Date(end_date);

    let sql = `SELECT (DATEDIFF("${ed}", "${sd}") + 1) 
     - (SELECT COUNT(*) AS no_of_holidays FROM holiday h WHERE h.is_deleted = 0 AND 
         (h.holiday_date BETWEEN '${sd}' AND '${ed}') 
         AND DAYOFWEEK(h.holiday_date) <> 1) 
     - (SELECT COUNT(*) AS sunday FROM (`;

     while(loop <= end){
         sql += `SELECT "${moment(loop).format("YYYY-MM-DD")}" AS mes ${loop.getDate() == end.getDate() ? '' : 'UNION '}`;
         loop = new Date(loop.setDate(loop.getDate() + 1));
     }
         
     sql += `) AS m WHERE DAYOFWEEK(m.mes) = 1) as no_of_days;`;

     let [rows] = await db.execute(sql);

     return rows;
}

// Get no_of_days field. Extract holidays and sunday;
const getNofLeaveDays = async(req, res, next) =>{
    let {leave_id} = req.body;
    
    if(leave_id  == -1){

        let {start_date, end_date} = req.body;

        if(end_date == null){
            req.body['no_of_days'] = 1;
            req.body['end_date'] = req.body['start_date'];
            next();
        }
        else{
           await getNofLeaveDaysExecute(start_date, end_date).then((rows)=>{
                if(rows.length > 0){
                    req.body['no_of_days'] = rows[0]['no_of_days'];
                    next();
                }
                else{
                    return res.status(400).json({'msg':'Something went wrong caculate no of days leave'});
                }
            });
        }
    }
    else{
        next();
    }
    
}

// Check leave Exist for this year, 
const checkLeaveExist = async(req, res, next) =>{
    let {leave_id} = req.body;
    
    if(leave_id  == -1){

        let {start_date, end_date} = req.body;
        let user_login_id = req.user.user_login_id;

        let sql = `SELECT COUNT(*) AS already_leave_exits FROM leave_requests lr
        WHERE lr.is_deleted = 0 AND ((DATE('${start_date}') BETWEEN lr.start_date AND lr.end_date) 
        OR (DATE('${end_date}') BETWEEN lr.start_date AND lr.end_date))
        AND lr.m_leave_status_id <> 3 AND lr.user_login_id = ${user_login_id}`;

        let [rows] = await db.execute(sql);
    
        if(rows.length > 0){
            if(rows[0]['already_leave_exits'] > 0){
                return res.status(400).json({'msg':'Leave Already exits'});
            }
            else{
                next();
            }
        }
    }
    else{
        next();
    }
  
}

// Check leave available for this year, 
// If is available to go next Else throw error msg;
const checkLeaveBalance = async(req, res, next) =>{
    let {leave_id} = req.body;
    
    if(leave_id  == -1){

        let {m_leave_type_id, start_date, end_date} = req.body;
        let user_login_id = req.user.user_login_id;

        let startYear = Number(moment(start_date).format("YYYY")); 
        let endYear = Number(moment(end_date).format("YYYY"));

   
        for(let i = startYear; i <= endYear; i++){

            let sd = (i == startYear) ? start_date : moment(end_date).startOf('month').format('YYYY-MM-DD');
            let ed = (i == endYear) ? end_date : moment(start_date).endOf('month').format('YYYY-MM-DD');
            
            let no_of_days = 0;

            await getNofLeaveDaysExecute(sd, ed).then((rows)=>{
                if(rows.length > 0){
                    no_of_days = rows[0]['no_of_days'];
                }
                else{
                    return res.status(400).json({'msg':'Something went wrong caculate no of days leave'});
                }
            });

            let sql = `SELECT mlt.no_of_days, SUM(lr.no_of_days) AS leave_taken, mlt.leave_type, ${i} as m_year FROM m_leave_type mlt 
            LEFT JOIN leave_requests lr ON lr.m_leave_type_id = mlt.m_leave_type_id AND lr.is_deleted = 0 
            AND lr.m_leave_status_id <> 3 AND (YEAR(lr.start_date) = '${i}' OR YEAR(lr.end_date) = '${i}') AND lr.user_login_id  = ${user_login_id}
            WHERE mlt.is_deleted = 0 AND mlt.m_leave_type_id IN (${m_leave_type_id})`;
            
            let [rows] = await db.execute(sql);
        
            if(rows.length > 0){
                if(rows[0]['no_of_days'] != null){
                    if(rows[0]['no_of_days'] < (Number(rows[0]['leave_taken']) + Number(no_of_days))){
                        let msg = `Your ${rows[0]['leave_type']} leave balance is ${Number(rows[0]['no_of_days']) - Number(rows[0]['leave_taken'])} days for ${rows[0]['m_year']} year. You have more than enough to take time off!`;
                        res.status(400).json({'msg':msg});
                        break;
                    }
                }

                if(i == endYear){
                    next();
                }
            }
            else{
                res.status(400).json({'msg':'Something went wrong calculate no of days leave'});
                break;
            }


        }
    }
    else{
        next();
    }

}

module.exports = {getNofLeaveDays, checkLeaveExist, checkLeaveBalance};