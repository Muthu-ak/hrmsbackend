const projectModel = require("../models/projectModel");
const adodb = require('../adodb');
const moment = require('moment');

const projectController = {
    async clients(req, res, next){
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

        _obj["orderBY"] = "ORDER BY c.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY c.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.clients(_obj);
            if(_obj.isExcel){
                req.excelData = data;
                next();
            }
            else{
                res.status(200).json(data);
            }
        } catch (err) {
            res.status(500).json({ "msg": err});
        }
    },
    async viewClient(req, res){
        try {
            const data = await projectModel.viewClient(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveClient(req, res){
        let pk = req.body.client_id;
        
        try{
            let id = await adodb.saveData("clients","client_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'client_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
    async projects(req, res, next){
        let params = req.query;

        let _obj = {
            isExcel : params.hasOwnProperty('excel') ? true : false,
            where:"",
            limit:""
        };

        const logger_type_id = req.user.m_user_type_id;
        const logger_id = req.user.user_login_id;

        if(logger_type_id == 20){
            _obj['where'] += ` AND ul.user_login_id = ${logger_id}`;
        }
        else if(logger_type_id == 1){
            _obj['where'] += ` AND pm.user_login_id = ${logger_id}`;
        }

        if(!_obj.isExcel){

            let cal = (params.currentpage - 1) * params.postperpage;
            let offset = cal < 0 ? 0 : cal;

            _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;
        }

        _obj["orderBY"] = "ORDER BY pt.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY ${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.projects(_obj);
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
    async viewProject(req, res){
        try {
            const data = await projectModel.viewProject(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async teamMembers(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let where = ` AND pm.project_id = ${req.query.project_id}`;
     
        let orderBY = "ORDER BY pm.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            orderBY = `ORDER BY pm.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.teamMembers(params.postperpage, offset, orderBY, where);
            res.status(200).json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async saveProject(req, res){
        let pk = req.body.project_id;

        if(req.body.hasOwnProperty('start_date') && String(req.body['start_date']).length > 0){
            req.body['start_date'] = moment(req.body['start_date']).format("YYYY-MM-DD");
        }

        if(req.body.hasOwnProperty('end_date') && String(req.body['end_date']).length > 0){
            req.body['end_date'] = moment(req.body['end_date']).format("YYYY-MM-DD");
        }

        try{
            let id = await adodb.saveData("projects","project_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'project_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },

    async saveTeamMember(req, res){
        let pk = req.body.project_member_id;

        try{
            let id = await adodb.saveData("project_members","project_member_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'project_member_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },

    async tasks(req, res, next){
        let params = req.query;

        let _obj = {
            isExcel : params.hasOwnProperty('excel') ? true : false,
            where:"",
            limit:""
        };

        if (params.hasOwnProperty('filter')) {
            for (let x in params.filter) {
                if (params.filter[x] != null) {
                    _obj["where"] += ` AND ts.${x} = ${params.filter[x]}`;
                }
            }
        }

        if(!_obj.isExcel){

            let cal = (params.currentpage - 1) * params.postperpage;
            let offset = cal < 0 ? 0 : cal;

            _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;
        }

        _obj["orderBY"] = "ORDER BY ts.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){

            let table_short_name = params.sorting["accessor"] == "project_status" ? 'ps' : 'ts';

            _obj["orderBY"] = `ORDER BY ${table_short_name}.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.tasks(_obj);
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

    async saveTask(req, res){
        let pk = req.body.task_id;

        try{

            if(req.body.hasOwnProperty('start_date')){
                req.body['start_date'] = moment(req.body['start_date']).format("YYYY-MM-DD");
            }

            if(req.body.hasOwnProperty('end_date')){
                req.body['end_date'] = moment(req.body['end_date']).format("YYYY-MM-DD");
            }

            let id = await adodb.saveData("tasks","task_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'task_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },

    async timesheets(req, res, next){
        let params = req.query;

        let _obj = {
            isExcel : params.hasOwnProperty('excel') ? true : false,
            where:"",
            limit:""
        };

        if (params.hasOwnProperty('filter')) {
            for (let x in params.filter) {
                if (params.filter[x] != null && params.filter[x] != -1) {
                    _obj["where"] += ` AND tm.${x} = ${params.filter[x]}`;
                }
            }
        }

        if(!_obj.isExcel){

            let cal = (params.currentpage - 1) * params.postperpage;
            let offset = cal < 0 ? 0 : cal;

            _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;
        }

        _obj["orderBY"] = "ORDER BY tm.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY tm.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.timesheets(_obj);
            if(_obj.isExcel){
                req.excelData = data;
                next();
            }
            else{
                res.status(200).json(data);
            }
        } catch (err) {
            res.status(500).json({ "msg": err});
        }
    },

    async saveTimesheets(req, res){
        let pk = req.body.timesheet_id;

        try{

            if(req.body.hasOwnProperty('start_date_time') && req.body['start_date_time'].length > 0){
                req.body['start_date_time'] = moment(req.body['start_date_time']).format("YYYY-MM-DD HH:mm:ss");
            }

            if(req.body.hasOwnProperty('end_date_time') && req.body['end_date_time'].length > 0){
                req.body['end_date_time'] = moment(req.body['end_date_time']).format("YYYY-MM-DD HH:mm:ss");
            }

            let id = await adodb.saveData("timesheets","timesheet_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'timesheet_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },


}

module.exports = projectController;