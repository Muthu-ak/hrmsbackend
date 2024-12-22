const masterModel = require('../models/masterModel');
const adodb = require('../adodb');
const moment = require('moment');
const masterController = {
    async userType(req, res){
        try {
            const data = await masterModel.userType();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async department(req, res){
        try {
            const data = await masterModel.department();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async designation(req, res){
        const m_department_id = req.query.m_department_id;
        if(!m_department_id){
            res.status(400).json({error:'Missing department'});
        }
        try {
            const data = await masterModel.designation(m_department_id);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async employeeStatus(req, res){
        try {
            const data = await masterModel.employeeStatus();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async attendanceStatus(req, res){
        try {
            const data = await masterModel.attendanceStatus();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async leaveStatus(req, res){
        try {
            const data = await masterModel.leaveStatus();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async leaveType(req, res){
        try {
            const data = await masterModel.leaveType();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async employeeFormMasters(req, res){
        try {
            const gender = await masterModel.gender();
            const bloodGroup = await masterModel.bloodGroup();
            const userType = await masterModel.userType();
            const department = await masterModel.department();
            const employeeStatus = await masterModel.employeeStatus();
            const banks = await masterModel.banks();
            const bankAccountType = await masterModel.bankAccountType();
            const documentNames = await masterModel.documentNames();
            res.status(200).json({gender, bloodGroup, userType, department, employeeStatus, banks, bankAccountType, documentNames});
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async holiday(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;
        try {
            const data = await masterModel.holiday(params.postperpage, offset);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async saveHoliday(req, res){
        let pk = req.body.holiday_id;
        req.body['holiday_date'] = moment(req.body['holiday_date']).format("YYYY-MM-DD");
        try{
            let id = await adodb.saveData("holiday","holiday_id",req.body);
            let msg = pk < 0 ? "Added Successfully" : "Updated Successfully";
            let code = pk > 0 ? 200 : 201;
            res.status(code).json({'holiday_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    }
}

module.exports = masterController;