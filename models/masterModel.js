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
    async userType(){
       let [rows] = await db.execute("SELECT CAST(mut.m_user_type_id AS CHAR) AS 'value', mut.user_type AS label FROM m_user_type mut WHERE mut.is_deleted = 0 AND mut.m_user_type_id <> 1000");
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
}

module.exports = masterModel;