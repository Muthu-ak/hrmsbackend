const dashboardModel = require("../models/dashboardModel");

const dashboardController = {
    async getAll(req, res){
        try {
            const notice = await dashboardModel.notice();
            const upcomingHolidays = await dashboardModel.upcomingHolidays();
            const todayBirthday = await dashboardModel.todayBirthday();
            const newHires = await dashboardModel.newHires();
            const workAnniversary = await dashboardModel.workAnniversary();
            res.status(200).json({notice, upcomingHolidays, todayBirthday, newHires, workAnniversary});
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

}

module.exports = dashboardController;