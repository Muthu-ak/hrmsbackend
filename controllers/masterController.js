const masterModel = require('../models/masterModel');

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
        const {m_department_id} = req.body;
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
}

module.exports = masterController;