const db = require('../config/db');

const dashboardModel = {
    async notice(){

        let [rows] = await db.execute(`SELECT n.notice_id, n.notice_title, n.notice_content, DATE_FORMAT(n.issue_date, "%d-%b-%Y") AS issue_date_display , n.issue_date, n.notice_status
FROM notice n WHERE n.is_deleted = 0 AND n.notice_status = 1 ORDER BY n.issue_date DESC LIMIT 10`);

        return rows;
    },
}

module.exports = dashboardModel;