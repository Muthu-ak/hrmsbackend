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
        WHEN ac.appraisal_status_id = 3 THEN "Completed" END) AS appraisal_status 
        FROM appraisal_cycle ac WHERE ac.is_deleted = 0 ${where} ${limit}`);

        _result['data'] = rows;

        return _result;
    },
}

module.exports = performanceModel;