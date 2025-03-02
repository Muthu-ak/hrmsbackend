const db = require('../config/db');

const masterModel = {
    async gender(){
       let [rows] = await db.execute("SELECT CAST(mg.m_gender_id AS CHAR) AS `value`, mg.gender_name AS label FROM m_gender mg WHERE mg.is_deleted = 0");
       return rows;
    },
    async bloodGroup(){
       let [rows] = await db.execute("SELECT CAST(mbg.m_blood_group_id AS CHAR) AS 'value', mbg.blood_group AS label FROM m_blood_group mbg WHERE mbg.is_deleted = 0");
       return rows;
    },
    async userType(m_user_type_id){
       where = `AND mut.m_user_type_id  NOT IN (1000, ${m_user_type_id})`;
       let [rows] = await db.execute(`SELECT CAST(mut.m_user_type_id AS CHAR) AS 'value', mut.user_type AS label FROM m_user_type mut WHERE mut.is_deleted = 0 ${where}`);
       return rows;
    },
    async department(){
       let [rows] = await db.execute("SELECT CAST(md.m_department_id AS CHAR) AS 'value', md.department_name AS label FROM m_departments md WHERE md.is_deleted = 0");
       return rows;
    },
    async designation(m_department_id){
       let [rows] = await db.execute("SELECT CAST(mdn.m_designation_id AS CHAR) AS 'value', mdn.designation_name AS label FROM m_designation mdn WHERE mdn.is_deleted = 0 AND mdn.m_department_id = ?",[m_department_id]);
       return rows;
    },
    async employeeStatus(){
       let [rows] = await db.execute("SELECT CAST(mes.m_employee_status_id AS CHAR) AS 'value', mes.employee_status AS label FROM m_employee_status mes WHERE mes.is_deleted = 0");
       return rows;
    },
    async banks(){
       let [rows] = await db.execute("SELECT CAST(mb.m_bank_id AS CHAR) AS 'value', mb.bank_name AS label FROM m_bank mb WHERE mb.is_deleted = 0 ORDER BY mb.bank_name ASC");
       return rows;
    },
    async bankAccountType(){
       const rows = [
            {'value':'1', 'label':'Checking'},
            {'value':'2', 'label':'Current'},
            {'value':'3', 'label':'Salary Account'},
            {'value':'4', 'label':'Savings'}
       ];
       return rows;
    },
    async documentNames(){
       const rows = [
            {'value':'1', 'label':'Aadhaar Card'},
            {'value':'2', 'label':'Pan Card'},
            {'value':'3', 'label':'Passport'}
       ];
       return rows;
    },
    async attendanceStatus(){
        let [rows] = await db.execute("SELECT CAST(mas.m_attendance_status_id AS CHAR) AS 'value', mas.attendance_status AS label FROM m_attendance_status mas WHERE mas.is_deleted = 0");
        return rows;
    },
    async leaveStatus(){
        let [rows] = await db.execute("SELECT CAST(mls.m_leave_status_id AS CHAR) AS 'value', mls.leave_status AS label FROM m_leave_status mls WHERE mls.is_deleted = 0");
        return rows;
    },
    async leaveType(){
        let [rows] = await db.execute("SELECT CAST(mlt.m_leave_type_id AS CHAR) AS 'value', mlt.leave_type AS label FROM m_leave_type mlt WHERE mlt.is_deleted = 0");
        return rows;
    },
    async leaveYear(){
      let [rows] = await db.execute(`SELECT CAST(YEAR(h.holiday_date) AS CHAR) AS 'value', 
          CAST(YEAR(h.holiday_date) AS CHAR) AS label, IF(YEAR(h.holiday_date) = YEAR(NOW()), true, false) AS selected
          FROM holiday h WHERE h.is_deleted = 0 GROUP BY YEAR(h.holiday_date)`);
      return rows;
    },
    async clients(){
        let [rows] = await db.execute("SELECT CAST(c.client_id AS CHAR) AS 'value' , c.client_name AS 'label' FROM clients c WHERE c.is_deleted = 0");
        return rows;
    },
    async projects(where){
        const sql = `SELECT CAST(p.project_id AS CHAR) AS 'value' , p.project_name AS 'label' FROM projects p 
         LEFT JOIN project_members pm ON pm.project_id = p.project_id AND pm.is_deleted = 0
         WHERE p.is_deleted = 0 ${where} GROUP BY p.project_id`;

        let [rows] = await db.execute(sql);
        return rows;
    },
    async projectStatus(){
        let [rows] = await db.execute("SELECT CAST(ps.project_status_id AS CHAR) AS 'value' , ps.project_status AS 'label' FROM project_status ps WHERE ps.is_deleted = 0");
        return rows;
    },
    async userList(where){

         let sql = `SELECT CAST(ul.user_login_id AS CHAR) AS 'value' , ul.user_name AS 'label' FROM user_login ul
         INNER JOIN employees e on e.user_login_id = ul.user_login_id AND e.is_deleted = 0 
         WHERE ul.is_deleted = 0 AND ul.m_user_type_id <> 1000  ${where} ORDER BY ul.user_name`;

        let [rows] = await db.execute(sql);
        return rows;
    },
    async employeeList(req){

      const user_login_id = req.user.user_login_id;

      let where = "";

      if(req.query.hasOwnProperty('appraisal_cycle_id')){
         where = ` AND ut.value NOT IN (SELECT al.user_login_id FROM appraisee_list al WHERE al.is_deleted = 0 AND al.appraisal_cycle_id = ${req.query.appraisal_cycle_id})`;
      }

      const sql = `WITH RECURSIVE user_table AS (
         SELECT CAST(ul.user_login_id AS CHAR) AS 'value' , ul.user_name AS 'label' FROM user_login ul
         LEFT JOIN employees e on e.user_login_id = ul.user_login_id AND e.is_deleted = 0 
         WHERE ul.is_deleted = 0 AND ul.user_login_id = ${user_login_id}
         UNION ALL
         SELECT CAST(ul.user_login_id AS CHAR) AS 'value' , ul.user_name AS 'label' FROM user_login ul
         LEFT JOIN employees e on e.user_login_id = ul.user_login_id AND e.is_deleted = 0 
         INNER JOIN user_table ut ON ut.value = e.reporting_id 
         WHERE ul.is_deleted = 0 
      ) SELECT * FROM user_table ut
       WHERE ut.value <> ${user_login_id} ${where} ORDER BY ut.label`;

      let [rows] = await db.execute(sql);

      return rows;

    },
   async appraisalCycle(req){
      let join = "";

      if(req.query.hasOwnProperty("user_login_id") && req.query.user_login_id > 0){
         join = ` INNER JOIN appraisee_list al ON al.appraisal_cycle_id = ac.appraisal_cycle_id 
         AND al.is_deleted = 0 AND al.user_login_id = ${req.query.user_login_id}`;
      }

      let [rows] = await db.execute(`SELECT CAST(ac.appraisal_cycle_id AS CHAR) AS 'value' , ac.appraisal_name AS 'label', ac.is_active FROM appraisal_cycle ac ${join} WHERE ac.is_deleted = 0`);
      return rows;
   },
   async tasks(project_id){
      let [rows] = await db.execute("SELECT CAST(ts.task_id AS CHAR) AS 'value' , ts.task_name AS 'label' FROM tasks ts WHERE ts.is_deleted = 0 AND ts.task_status_id <> 4 AND ts.project_id = ?", [project_id]);
      return rows;
   },
   async teamMembers(where){
      let [rows] = await db.execute(`SELECT CAST(pm.project_member_id AS CHAR) AS 'value' , ul.user_name AS 'label' FROM project_members pm
      INNER JOIN user_login ul ON ul.user_login_id = pm.user_login_id AND ul.is_deleted = 0
      WHERE pm.is_deleted = 0  ${where}`);
      return rows;
   },
   async recursiveUser(user_login_id, is_include_login_user = false){

      let where = "";

      if(!is_include_login_user){
         where = `WHERE user_login_id <> ${user_login_id}`;
      }
   
      const sql = `WITH RECURSIVE user_table AS (
         SELECT ul.user_login_id FROM user_login ul 
         LEFT JOIN employees e ON e.user_login_id = ul.user_login_id AND e.is_deleted = 0
         WHERE ul.user_login_id = ${user_login_id} AND ul.is_deleted = 0
         UNION ALL 
         SELECT ul.user_login_id FROM user_login ul 
         LEFT JOIN employees e ON e.user_login_id = ul.user_login_id AND e.is_deleted = 0
         JOIN user_table ut ON ut.user_login_id = e.reporting_id
         WHERE ul.is_deleted = 0 
      ) SELECT * FROM user_table ${where}`;

      let [rows] = await db.execute(sql);

      const userLoginIds = rows.map(item => item.user_login_id).join(',');

      return userLoginIds;
   }
}

module.exports = masterModel;