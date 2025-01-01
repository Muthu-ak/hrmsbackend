const db = require('../config/db');

const payrollModel = {
    async payrollList(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT COUNT(*) AS counts FROM payroll pr  WHERE pr.is_deleted = 0 `);

        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) AS s_no, pr.payroll_id, 
        pr.user_login_id, pr.payroll_month, pr.basic_salary, ul.user_name,
        SUM(pr.house_rent_allowance + pr.house_rent_allowance + pr.medical_allowance + pr.transport_allowance + pr.other_allowance) AS allowances, 
        pr.bonus, pr.gross_salary, pr.tax, pr.other_deduction, pr.net_salary
        FROM payroll pr INNER JOIN user_login ul ON ul.user_login_id = pr.user_login_id AND ul.is_deleted = 0 WHERE pr.is_deleted = 0  HAVING allowances > 0 ${limit}`);

        return {data:rows, totalRecord:count[0]['counts']};
    },
    async viewHoliday(params){

        let [rows] = await db.execute(`SELECT h.holiday_id, h.holiday_title,  h.holiday_date
        FROM holiday h WHERE h.is_deleted = 0 AND h.holiday_id = ?`, [params.holiday_id]);

        return rows;
    },
}

module.exports = payrollModel;