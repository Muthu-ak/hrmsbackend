const leaveModel = require("../models/leaveModel");
const adodb = require('../adodb');
const db = require('../config/db');
const moment = require('moment');
const {emailTransport} = require("../email/nodemailerFn");
const leaveController = {
    async holiday(req, res, next){
        let params = req.query;

        let _obj = {
            isExcel : params.hasOwnProperty('excel') ? true : false,
            where:"",
            limit:""
        };

        if(!_obj.isExcel){

            let cal = (params.currentpage - 1) * params.postperpage;
            let offset = cal < 0 ? 0 : cal;

            _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;
        }

        if(params.filter['m_year_id'] != null){
            _obj['where'] = ` AND YEAR(h.holiday_date) IN (${params.filter['m_year_id']})`;
        }

        _obj["orderBY"] = "ORDER BY h.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            if(params.sorting['accessor'] == 'holiday_day'){
                _obj["orderBY"] = `ORDER BY DATE_FORMAT(h.holiday_date, '%W') ${params.sorting["direction"]}`;
            }
            else{
                _obj["orderBY"] = `ORDER BY h.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }

        try {
            const data = await leaveModel.holiday(_obj);
            if(_obj.isExcel){
                req.excelData = data;
                next();
            }
            else{
                res.status(200).json(data);
            }
        } catch (err) {
            res.status(500).json({ error: err.message});
        }
    },
    async viewHoliday(req, res){
        try {
            const data = await leaveModel.viewHoliday(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveHoliday(req, res){
        let pk = req.body.holiday_id;
        if(req.body.hasOwnProperty('holiday_date')){
            req.body['holiday_date'] = moment(req.body['holiday_date']).format("YYYY-MM-DD");
        }
       
        try{
            let id = await adodb.saveData("holiday","holiday_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'holiday_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
    async leaveType(req, res, next){
        let params = req.query;

        let _obj = {
            isExcel : params.hasOwnProperty('excel') ? true : false,
            where:"",
            limit:""
        };

        if(!_obj.isExcel){

            let cal = (params.currentpage - 1) * params.postperpage;
            let offset = cal < 0 ? 0 : cal;

            _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;
        }

        _obj["orderBY"] = "ORDER BY mlt.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY mlt.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await leaveModel.leaveType(_obj);
            if(_obj.isExcel){
                req.excelData = data;
                next();
            }
            else{
                res.status(200).json(data);
            }
        } catch (err) {
            res.status(500).json({ error: err.message});
        }
    },
    async viewLeaveType(req, res){
        try {
            const data = await leaveModel.viewLeaveType(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveLeaveType(req, res){
        let pk = req.body.m_leave_type_id;
        try{
            let id = await adodb.saveData("m_leave_type","m_leave_type_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'m_leave_type_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
    async myleaves(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        const logger_id = req.user.user_login_id;

        let orderBY = "ORDER BY lr.m_leave_status_id, lr.created_on";

        let where = ` AND ul.user_login_id = ${logger_id}`;

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            if (params.sorting["accessor"] == "leave_type") {
                orderBY = `ORDER BY mlt.leave_type ${params.sorting["direction"]}`;
            }
            else if (params.sorting["accessor"] == "leave_status") {
                orderBY = `ORDER BY mls.leave_status ${params.sorting["direction"]}`;
            }
            else{
                orderBY = `ORDER BY lr.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }
        try {
            const data = await leaveModel.leaveRequest(params.postperpage, offset, orderBY, where);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async leaveRequest(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let orderBY = "ORDER BY lr.m_leave_status_id, lr.created_on";

        let where = ``;

        const logger_type_id = req.user.m_user_type_id;
        const logger_id = req.user.user_login_id;

        if(logger_type_id == 20){
            where += ` AND e.reporting_id = ${logger_id}`;
        }
        else if(logger_type_id == 100){
            where += ` AND e.reporting_id = ${logger_id} OR e.reporting_id IN (SELECT e.user_login_id FROM employees e WHERE e.is_deleted = 0 AND e.reporting_id = ${logger_id})`;
        }

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            if (params.sorting["accessor"] == "user_name") {
                orderBY = `ORDER BY ul.user_name ${params.sorting["direction"]}`;
            }
            else if (params.sorting["accessor"] == "leave_type") {
                orderBY = `ORDER BY mlt.leave_type ${params.sorting["direction"]}`;
            }
            else if (params.sorting["accessor"] == "leave_status") {
                orderBY = `ORDER BY mls.leave_status ${params.sorting["direction"]}`;
            }
            else{
                orderBY = `ORDER BY lr.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }

        try {
            const data = await leaveModel.leaveRequest(params.postperpage, offset, orderBY, where);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewLeaveRequest(req, res){
        try {
            const basic = await leaveModel.viewLeaveRequest(req.query);
            const recentLeaveHistory = await leaveModel.recentLeaveHistory(req.query.user_login_id);
            res.status(200).json({
                'basic' : basic.length > 0 ? basic[0] : null,
                'recentLeaveHistory' : recentLeaveHistory.length > 0 ? recentLeaveHistory : null
            });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async saveLeaveRequest(req, res){
        let pk = req.body.leave_id;

        if(req.body.hasOwnProperty('start_date')){
            req.body['start_date'] = moment(req.body['start_date']).format("YYYY-MM-DD");
        }

        if(req.body.hasOwnProperty('end_date') && req.body?.end_date != null){
            req.body['end_date'] = moment(req.body['end_date']).format("YYYY-MM-DD");
        }

        try{
            await db.query('BEGIN');

            let id = await adodb.saveData("leave_requests","leave_id",req.body, req.user);

            if(id > 0){

              const basic = await leaveModel.viewLeaveRequest({'leave_id':id});

              let template = (pk > 0) ? "leaveApproval" : "leaveRequest";
              let subject = (pk > 0) ? `${basic[0]['leave_status']} leave request` : `${basic[0]['leave_type']} leave request`;
              

              let isEmailed = await emailTransport('mgrvijay97@gmail.com', subject, template, basic[0]);

              if(isEmailed){
                await db.query('COMMIT');

                let msg = (pk < 0) ? "Request Submitted" : "Status Updated Successfully";
                let code = pk > 0 ? 200 : 201;
                
                res.status(code).json({'leave_id': id, "msg": msg});
              }
              else{
                throw new Error('Something Wrong in Email Sent.');
              }
            }
            else{
                throw new Error('Request Not Submitted.');
            }
            
        }
        catch(err){
            await db.query('ROLLBACK');
            res.status(400).json({"msg":err});
        }
    },
}

module.exports = leaveController;