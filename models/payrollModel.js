const db = require('../config/db');

const payrollModel = {
    async payrollList(pagesize, offset, orderBY, where){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(*) AS counts FROM payroll pr  WHERE pr.is_deleted = 0 ${where}`);

        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) AS s_no, pr.payroll_id, 
        pr.user_login_id, DATE_FORMAT(pr.payroll_date, "%d-%b-%Y") AS payroll_date, pr.basic_salary, ul.user_name,
        (pr.house_rent_allowance + pr.house_rent_allowance + pr.medical_allowance + pr.transport_allowance + pr.other_allowance) AS allowances, 
        pr.bonus, pr.gross_salary, pr.tax, pr.other_deduction, pr.net_salary
        FROM payroll pr INNER JOIN user_login ul ON ul.user_login_id = pr.user_login_id AND ul.is_deleted = 0 WHERE pr.is_deleted = 0 ${where} ${limit}`);

        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewPayroll(params){

        let [rows] = await db.execute(`SELECT  pr.payroll_id, 
        pr.user_login_id, DATE_FORMAT(pr.payroll_date, "%d-%b-%Y") AS payroll_date, 
        pr.basic_salary, ul.user_name, pr.house_rent_allowance, pr.house_rent_allowance , pr.medical_allowance, pr.transport_allowance , pr.other_allowance,
        pr.bonus, pr.gross_salary, pr.tax, pr.other_deduction, pr.net_salary
        FROM payroll pr INNER JOIN user_login ul ON ul.user_login_id = pr.user_login_id AND ul.is_deleted = 0 
        WHERE pr.is_deleted = 0 AND pr.payroll_id = ?`, [params.payroll_id]);

        return rows;
    },
}

module.exports = payrollModel;