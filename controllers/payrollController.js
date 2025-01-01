const payrollModel = require("../models/payrollModel");
const adodb = require('../adodb');
const moment = require('moment');

const payrollController = {
    async payrollList(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let orderBY = "ORDER BY pr.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            if (params.sorting["accessor"] == "user_name") {
                orderBY = `ORDER BY ul.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
            else{
                orderBY = `ORDER BY pr.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }

        try {
            const data = await payrollModel.payrollList(params.postperpage, offset, orderBY);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async viewLeaveType(req, res){
        try {
            const data = await payrollModel.viewLeaveType(req.query);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveLeaveType(req, res){
        let pk = req.body.m_leave_type_id;
        try{
            let id = await adodb.saveData("m_leave_type","m_leave_type_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'m_leave_type_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
}

module.exports = payrollController;