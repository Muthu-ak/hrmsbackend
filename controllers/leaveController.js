const leaveModel = require("../models/leaveModel");
const adodb = require('../adodb');
const moment = require('moment');

const leaveController = {
    async holiday(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let orderBY = "ORDER BY h.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            if(params.sorting['accessor'] == 'holiday_day'){
                orderBY = `ORDER BY DATE_FORMAT(h.holiday_date, '%W') ${params.sorting["direction"]}`;
            }
            else{
                orderBY = `ORDER BY h.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
            }
        }

        try {
            const data = await leaveModel.holiday(params.postperpage, offset, orderBY);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
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
            let id = await adodb.saveData("holiday","holiday_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'holiday_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    }
}

module.exports = leaveController;