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
        is_active, is_rating
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
    async goal({limit, orderBY , where}){
        let _result = {};
        
        let [count] = await db.execute(`SELECT COUNT(gl.goal_id) AS counts FROM goal gl WHERE gl.is_deleted = 0 ${where}`);
        _result['totalRecord'] = count[0]['counts'];

        let sql = `SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, gl.goal_id, gl.user_login_id, gl.goal_name, 
        DATE_FORMAT(gl.start_date, '%d-%b-%Y') AS start_date,  
        DATE_FORMAT(gl.end_date, '%d-%b-%Y') AS end_date, gl.description, gl.weightage, gl.progress, 
        (CASE WHEN gl.progress = 0 THEN 'Yet to Start' WHEN gl.progress = 100 THEN 'Completed' ELSE 'Inprogess' END) AS goal_status 
        FROM goal gl WHERE gl.is_deleted = 0 ${where} ${limit}`;
    
        let [rows] = await db.execute(sql);

        _result['data'] = rows;

        return _result;
    },
}

module.exports = performanceModel;