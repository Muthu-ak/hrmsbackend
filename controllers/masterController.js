const masterModel = require('../models/masterModel');

const masterController = {
    async userType(req, res){
        try {
            let m_user_type_id = req.user.m_user_type_id;
            const data = await masterModel.userType(m_user_type_id);
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
    async leaveYear(req, res){
        try {
            const data = await masterModel.leaveYear();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async userList(req, res){
        try {
            let m_user_type_id = req.user.m_user_type_id;
            const data = await masterModel.userList(req.query, m_user_type_id);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async reportingList(req, res){
        let obj = {};
        switch(req.query.m_user_type_id){
            case '1':
                obj["m_user_type_id"] = 20;
                break;
            case '20':
                obj["m_user_type_id"] = 100;
                break;
            default:
                obj["m_user_type_id"] = 1000;
                break;
        }
        try {
            const data = await masterModel.userList(obj);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async employeeFormMasters(req, res){
        let m_user_type_id = req.user.m_user_type_id;
        try {
            const gender = await masterModel.gender();
            const bloodGroup = await masterModel.bloodGroup();
            const userType = await masterModel.userType(m_user_type_id);
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
    async clients(req, res){
        try {
            const data = await masterModel.clients();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async projects(req, res){
        let where = "";
        let m_user_type_id = req.user.m_user_type_id;
        let user_login_id = req.user.user_login_id;

        if(m_user_type_id == 20){
            where = ` AND project_manager_id = ${user_login_id}`;
        }

        try {
            const data = await masterModel.projects(where);
            let selected_id = null;
            if(req.query.project_id == null){
                selected_id = data[0]['value'];
                data[0] = {...data[0], selected:true};
            }
            else{
                data.forEach((item, index)=>{
                    if(req.query.project_id == item.value){
                        selected_id = data[index]['project_id'];
                        data[index] = {...data[index], selected:true};
                    }
                });
            }
            res.status(200).json({data, selected_id});
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    async projectStatus(req, res){
        try {
            const data = await masterModel.projectStatus();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

}

module.exports = masterController;