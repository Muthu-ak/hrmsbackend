const db = require('../config/db');

const leaveModel = {
    async holiday(pagesize, offset, orderBY){
        let limit = `LIMIT ${pagesize} OFFSET ${offset}`;

        let [count] = await db.execute(`SELECT count(h.holiday_id) as counts FROM holiday h WHERE h.is_deleted = 0`);
        let [rows] = await db.execute(`SELECT ROW_NUMBER() OVER(${orderBY}) as s_no,  h.holiday_id, h.holiday_title, DATE_FORMAT(h.holiday_date, '%d-%b-%Y') as holiday_date,
          DATE_FORMAT(h.holiday_date, '%W') AS holiday_day FROM holiday h WHERE h.is_deleted = 0 ${limit}`);
         return {data:rows, totalRecord:count[0]['counts']};
   },
    async viewHoliday(params){

        let [rows] = await db.execute(`SELECT h.holiday_id, h.holiday_title,  h.holiday_date
        FROM holiday h WHERE h.is_deleted = 0 AND h.holiday_id = ?`, [params.holiday_id]);

        return rows;
   },

}

module.exports = leaveModel;