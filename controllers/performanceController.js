const performanceModel = require("../models/performanceModel");
const adodb = require('../adodb');
const moment = require('moment');

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
    async goal(req, res){
        let params = req.query;

        let _obj = {
            where:"",
            limit:""
        };

        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        _obj["limit"] = `LIMIT ${params.postperpage} OFFSET ${offset}`;

        _obj["orderBY"] = "ORDER BY gl.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY gl.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await performanceModel.goal(_obj);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: err.message});
        }
    },
    async saveGoal(req, res){
        let pk = req.body.goal_id;

        if(req.body.hasOwnProperty('goal_date')){
            req.body['start_date'] = moment(req.body['goal_date'][0]).format("YYYY-MM-DD");
            req.body['end_date'] = moment(req.body['goal_date'][1]).format("YYYY-MM-DD");
        }
        
        try{
            let id = await adodb.saveData("goal","goal_id", req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'goal_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
}

module.exports = performanceController;