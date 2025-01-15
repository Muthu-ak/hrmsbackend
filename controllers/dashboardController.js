const dashboardModel = require("../models/dashboardModel");

const dashboardController = {
    async getAll(req, res){
        try {
            const notice = await dashboardModel.notice();
            const upcomingHolidays = await dashboardModel.upcomingHolidays();
            const todayBirthday = await dashboardModel.todayBirthday();
            const newHires = await dashboardModel.newHires();
            const workAnniversary = await dashboardModel.workAnniversary();
            const adminCard = await dashboardModel.adminCard();
        
            res.status(200).json({
                notice:notice, 
                upcomingHolidays:upcomingHolidays, 
                todayBirthday:todayBirthday.length > 0 ? todayBirthday : null, 
                newHires:newHires, 
                workAnniversary:workAnniversary, 
                adminCard:adminCard
            });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

}

module.exports = dashboardController;