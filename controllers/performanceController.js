const performanceModel = require("../models/performanceModel");
const masterModel = require("../models/masterModel");
const adodb = require('../adodb');
const moment = require('moment');
const db = require('../config/db');

const performanceController = {
    async appraisalCycleList(req, res, next){
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

        _obj["orderBY"] = "ORDER BY ac.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY ac.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await performanceModel.appraisalCycleList(_obj);
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
    async saveAppraisalCycle(req, res){
        let pk = req.body.appraisal_cycle_id;

        if(req.body.hasOwnProperty('appraisal_date')){
            req.body['start_date'] = moment(req.body['appraisal_date'][0]).format("YYYY-MM-DD");
            req.body['end_date'] = moment(req.body['appraisal_date'][1]).format("YYYY-MM-DD");
        }
        
        try{

            if(req.body.hasOwnProperty('is_active')){
                let sql = `UPDATE appraisal_cycle ac SET ac.is_active = 0 WHERE ac.is_deleted = 0 AND ac.appraisal_cycle_id != ${pk} `;
                await db.execute(sql);
            }

            let id = await adodb.saveData("appraisal_cycle","appraisal_cycle_id", req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'appraisal_cycle_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
    async competency(req, res, next){
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

        _obj["orderBY"] = "ORDER BY com.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY com.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await performanceModel.competency(_obj);
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
    async saveCompetency(req, res){
        let pk = req.body.compentency_id;
        
        try{
            let id = await adodb.saveData("compentency","compentency_id", req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'compentency_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
    async questions(req, res){
        try {
            const data = await performanceModel.questions(req);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({'msg': err.message});
        }
    },
    async saveSelfAppraisal(req, res){

        const {responses, user_login_id} = req.body;
       
        try{
            for(let i = 0; i < responses.length; i++){

                responses[i]['user_login_id'] = user_login_id;

                await adodb.saveData("self_appraisal","self_appraisal_id", responses[i], req.user);

            }

            await adodb.saveData("appraisee_list","appraisee_id", req.body, req.user);

            res.status(200).json({"msg": "Successfully Submitted"});
        }
        catch(err){
            res.status(400).json({"msg":err.message});
        }

    },
    async appraiseelist(req, res, next){
        let params = req.query;

        let _obj = {
            isExcel : params.hasOwnProperty('excel') ? true : false,
            where:"",
            limit:""
        };

        // Recursive user
        const user_login_ids = await masterModel.recursiveUser(req.user.user_login_id);

        _obj['where'] = ` AND al.user_login_id IN (${user_login_ids}) `;


        if (params.hasOwnProperty('appraisal_cycle_id')) {
            _obj["where"] += ` AND al.appraisal_cycle_id = ${params.appraisal_cycle_id}`;
        }

        if(!_obj.isExcel){

            let cal = (params.currentpage - 1) * params.postperpage;
            let offset = cal < 0 ? 0 : cal;

            _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;
        }

        _obj["orderBY"] = "ORDER BY ul.user_name";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY al.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = user_login_ids ? await performanceModel.appraiseelist(_obj) : {'data':[], 'totalRecord':0};
            if(_obj.isExcel){
                req.excelData = data;
                next();
            }
            else{
                res.status(200).json(data);
            }
        } catch (err) {
            res.status(500).json({'msg': err.message});
        }
    },
    async saveAppraiseelist(req, res){
        let pk = req.body.appraisee_id;
        
        try{
            let id = await adodb.saveData("appraisee_list","appraisee_id", req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'appraisee_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err.message});
        }
    },
    async viewAppraisee(req, res){
        try {
            const data = await performanceModel.viewAppraisee(req);
            res.status(200).json(data);
        } catch (err) {
            res.status(400).json({'msg': err.message});
        }
    },
}

module.exports = performanceController;