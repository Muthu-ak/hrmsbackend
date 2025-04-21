const db = require('../config/db');

const organizationModel = {
    async department({isExcel, limit, orderBY , where}){
        let _result = {};

        let excel_not_include_fields = "";

        if(!isExcel){
            excel_not_include_fields = "md.m_department_id,";
            let [count] = await db.execute(`SELECT count(md.m_department_id) as counts FROM m_departments md WHERE md.is_deleted = 0 ${where}`);
            _result['totalRecord'] = count[0]['counts'];
        }
     
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, ${excel_not_include_fields} md.department_name FROM m_departments md WHERE md.is_deleted = 0 ${where} ${limit}`);
        _result['data'] = rows;

        return _result;
    },

    async viewDepartment(params){

        let [rows] = await db.execute(`SELECT md.m_department_id, md.department_name FROM m_departments md WHERE md.is_deleted = 0 AND md.m_department_id = ?`, [params.m_department_id]);

        return rows;
    },
    async designation({isExcel, limit, orderBY , where}){
        let _result = {};

        let excel_not_include_fields = "";
        
        const join = ` INNER JOIN m_departments md ON md.m_department_id = mdn.m_department_id AND md.is_deleted = 0 `;

        if(!isExcel){
            excel_not_include_fields = "mdn.m_designation_id, mdn.m_department_id,";
            let [count] = await db.execute(`SELECT count(mdn.m_designation_id) as counts FROM m_designation mdn ${join} WHERE mdn.is_deleted = 0 ${where}`);
            _result['totalRecord'] = count[0]['counts'];
        }
     
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, ${excel_not_include_fields} mdn.designation_name, md.department_name FROM m_designation mdn 
            ${join} WHERE mdn.is_deleted = 0 ${where} ${limit}`);

        _result['data'] = rows;

        return _result;
    },

    async viewDesignation(params){

        let [rows] = await db.execute(`SELECT mdn.m_designation_id, mdn.m_department_id, mdn.designation_name FROM m_designation mdn 
            WHERE mdn.is_deleted = 0 AND mdn.m_designation_id = ?`, [params.m_designation_id]);

        return rows;
    },

}

module.exports = organizationModel;