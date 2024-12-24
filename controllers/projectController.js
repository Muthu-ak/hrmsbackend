const projectModel = require("../models/projectModel");
const adodb = require('../adodb');

const projectController = {
    async clients(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let orderBY = "ORDER BY c.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            orderBY = `ORDER BY c.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.clients(params.postperpage, offset, orderBY);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
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
            let id = await adodb.saveData("clients","client_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'client_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
    async projects(req, res){
        let params = req.query;
        let cal = (params.currentpage - 1) * params.postperpage;
        let offset = cal < 0 ? 0 : cal;

        let orderBY = "ORDER BY pt.created_on DESC";
        if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
            orderBY = `ORDER BY pt.${params.sorting["accessor"]} ${params.sorting["direction"]}`;
        }

        try {
            const data = await projectModel.projects(params.postperpage, offset, orderBY);
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
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
    async saveProject(req, res){
        let pk = req.body.project_id;
        
        try{
            let id = await adodb.saveData("projects","project_id",req.body);

            let msg = req.body.hasOwnProperty('is_deleted') ? "Deleted Successfully" : (pk < 0) ? "Added Successfully" : "Updated Successfully";

            let code = pk > 0 ? 200 : 201;

            res.status(code).json({'project_id': id, "msg": msg});
        }
        catch(err){
            res.status(400).json({"msg":err});
        }
    },
}

module.exports = projectController;