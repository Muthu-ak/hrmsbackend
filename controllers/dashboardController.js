const dashboardModel = require("../models/dashboardModel");

const dashboardController = {
    async getAll(req, res){
        try {
            const notice = await dashboardModel.notice();
            res.status(200).json({notice});
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

}

module.exports = dashboardController;