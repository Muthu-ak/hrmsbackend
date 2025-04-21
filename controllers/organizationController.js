const organizationModel = require("../models/organizationModel");
const adodb = require('../adodb');
const moment = require('moment');

const organizationController = {
    async department(req, res, next){
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

        _obj["orderBY"] = "ORDER BY md.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            _obj["orderBY"] = `ORDER BY md.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await organizationModel.department(_obj);
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
    async viewDepartment(req, res){
        try {
            const data = await organizationModel.viewDepartment(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveDepartment(req, res){
        let pk = req.body.m_department_id;
        try{
            let id = await adodb.saveData("m_departments","m_department_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'m_department_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },

    async designation(req, res, next){
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

        _obj["orderBY"] = "ORDER BY mdn.created_on DESC";

        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){

            const alias_name = ['department_name'].includes(params.sorting["accessor"]) ? 'md' : 'mdn';

            _obj["orderBY"] = `ORDER BY ${alias_name}.${params.sorting["accessor"]} ${params.sorting["direction"]}`;

        }

        try {
            const data = await organizationModel.designation(_obj);
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
    async viewDesignation(req, res){
        try {
            const data = await organizationModel.viewDesignation(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveDesignation(req, res){
        let pk = req.body.m_designation_id;
        try{
            let id = await adodb.saveData("m_designation","m_designation_id",req.body, req.user);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'m_designation_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },

}

module.exports = organizationController;