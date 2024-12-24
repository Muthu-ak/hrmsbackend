const db = require('../config/db');

const projectModel = {
    async clients(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(c.client_id) AS counts FROM clients c WHERE c.is_deleted = 0`);
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, c.client_id, c.client_name,
             c.contact_person_name, c.contact_no, c.email_id FROM clients c WHERE c.is_deleted = 0 ${limit}`);
  
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewClient(params){

        let [rows] = await db.execute(`SELECT c.client_id, c.client_name, c.contact_person_name, c.contact_no,
             c.email_id FROM clients c WHERE c.is_deleted = 0 AND c.client_id = ?`, [params.client_id]);

        return rows;
    },
    async projects(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(pt.project_id) AS counts FROM projects pt WHERE pt.is_deleted = 0`);
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no, pt.project_id, pt.project_name, pt.project_description, c.client_name, ul.user_name AS project_manager,
        DATE_FORMAT(pt.start_date, "%d-%b-%Y") AS start_date, DATE_FORMAT(pt.end_date, "%d-%b-%Y") AS end_date,
        IF(pt.status = 1, "Active", "Inactive") AS status FROM projects pt
        INNER JOIN clients c ON c.client_id = pt.client_id AND c.is_deleted = 0
        INNER JOIN user_login ul ON ul.user_login_id = pt.project_manager_id AND ul.is_deleted = 0
        WHERE pt.is_deleted = 0 ${limit}`);
  
        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewProject(params){

        let [rows] = await db.execute(`SELECT  pt.project_id, pt.project_name, pt.project_description, CAST(pt.client_id AS CHAR) AS client_id  , 
            CAST(pt.project_manager_id AS CHAR) as project_manager_id, 
            DATE_FORMAT(pt.start_date, "%d-%b-%Y") AS start_date, DATE_FORMAT(pt.end_date, "%d-%b-%Y") AS end_date,
            CAST(pt.status AS CHAR) AS status FROM projects pt WHERE pt.is_deleted = 0 AND pt.project_id = ?`, [params.project_id]);

        return rows;
    },
}

module.exports = projectModel;