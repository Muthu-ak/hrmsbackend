const attendanceModel = require("../models/attendanceModel");
const masterModel = require("../models/masterModel");
const db = require("../config/db");
const adodb = require('../adodb');
const moment = require("moment");

const attendanceController = {
    async attendance(req, res) {
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;
        let where = "";

        // Recursive user
        const user_login_ids = await masterModel.recursiveUser(req.user.user_login_id, true);

        where += ` AND ul.user_login_id IN (${user_login_ids}) `;
   
        let orderBY = "ORDER BY att.attendance_date DESC";
        if (params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none') {
            if (params.sorting["accessor"] == "user_name") {
                orderBY = `ORDER BY ul.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
            else if (params.sorting["accessor"] == "attendance_status") {
                orderBY = `ORDER BY mas.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
            else if (params.sorting["accessor"] == "working_hours") {
                orderBY = `ORDER BY DATE_FORMAT(TIMEDIFF(att.punch_out, att.punch_in), "%h:%i") ${params.sorting["direction"]}`;
            }
            else {
                orderBY = `ORDER BY att.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }

        if (params.hasOwnProperty('filter')) {
            for (let x in params.filter) {
                if (params.filter[x] != null && x == "attendance_date") {
                    where += ` AND att.${x} = Date('${moment(params.filter[x]).format('YYYY-MM-DD')}')`;
                }
                else if (params.filter[x] != null) {
                    where += ` AND att.${x} = ${params.filter[x]}`;
                }
            }
        }

        try {
            const data = await attendanceModel.attendance(params.postperpage, offset, orderBY, where);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewAttendance(req, res) {
        try {
            const data = await attendanceModel.viewAttendance(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveAttendance(req, res) {
        let pk = req.body.attendance_id;

        if (!req.body.hasOwnProperty("is_deleted")) {
            req.body["attendance_date"] = moment(req.body.attendance_date).format("YYYY-MM-DD");
        }

        if(!req.body.hasOwnProperty("m_attendance_status_id") && req.body.attendance_id == -1){
            const sql = `SELECT (CASE WHEN TIME('${req.body.punch_in}') > c.start_time THEN 2 ELSE 1 END) AS m_attendance_status_id FROM company c WHERE c.is_deleted = 0`;
            let [row] = await db.execute(sql);
            req.body['m_attendance_status_id'] = row[0]['m_attendance_status_id'];
        }
       
        try {
            let id = await adodb.saveData("attendance", "attendance_id", req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({ 'attendance_id': id, "msg": msg });
        }
        catch (err) {
            res.status(400).json({ "msg": err });
        }
    },

    async attendanceReport(req, res, next){
        let params = req.query;

        let _obj = {
            isExcel : params.hasOwnProperty('excel') ? true : false,
            where:"",
            limit:"",
            joinWhere:"",
            daysQuery:""
        };

        if(!_obj.isExcel){

            let cal = (params.currentpage - 1) * params.postperpage;
            let offset = cal < 0 ? 0 : cal;

            _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;
        }

        if(params.filter?.['user_login_id'] != null){
            _obj['where'] = ` AND ul.user_login_id IN (${params.filter['user_login_id']})`;
        }

        const start_date = moment(params.filter['attendance_date']).startOf('month').format("YYYY-MM-DD");
        const end_date = moment(params.filter['attendance_date']).endOf('month').format("YYYY-MM-DD");
        
        _obj['joinWhere'] = ` AND a.attendance_date BETWEEN '${start_date}' AND '${end_date}' `;

        _obj["orderBY"] = "ORDER BY ul.user_name";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY ul.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        let final_date = new Date(end_date).getDate();
        let header = [];
        for(let i=1; i <= final_date; i++){
            let comma = (i != final_date) ? ',' : "";
            _obj["daysQuery"] += ` MAX(CASE WHEN DAY(a.attendance_date) = ${i} THEN a.m_attendance_status_id END) AS day_${i} ${comma} `;

            header.push({
                'Header':`${i}`,
                'accessor':`day_${i}`
            });
        }

        try {
            const data = await attendanceModel.attendanceReport(_obj);
            if(_obj.isExcel){
                req.excelData = data;
                next();
            }
            else{
                data['header'] = header;
                res.status(200).json(data);
            }
        } catch (err) {
            res.status(500).json({ error: err.message});
        }
    },
}

module.exports = attendanceController;