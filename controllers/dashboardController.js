const dashboardModel = require("../models/dashboardModel");
const dashboardController = {
    async getAll(req, res){

        let _obj = [
            {name:"present", value:0, color: '#2196F3' },
            {name:"absent", value:0, color: 'red.8' },
            {name:"late", value:0, color: 'yellow.5' },
            {name:"leave", value: 0, color: 'red.2' },
        ];

        try {
            const notice = await dashboardModel.notice();
            const upcomingHolidays = await dashboardModel.upcomingHolidays();
            const todayBirthday = await dashboardModel.todayBirthday();
            const newHires = await dashboardModel.newHires();
            const workAnniversary = await dashboardModel.workAnniversary();
            const adminCard = await dashboardModel.adminCard();
            const attendanceChart = await dashboardModel.attendanceChart();

            _obj.forEach((item, index)=>{
                _obj[index]['value'] = Math.round(attendanceChart[0][item['name']]);
            });

            res.status(200).json({
                notice:notice, 
                upcomingHolidays:upcomingHolidays, 
                todayBirthday:todayBirthday.length > 0 ? todayBirthday : null, 
                newHires:newHires, 
                workAnniversary:workAnniversary, 
                adminCard:adminCard,
                attendanceChart:_obj
            });
        } catch (err) {
            res.status(500).json({ msg: err.message});
        }
    },
    async attendance(req, res){
        try {
            const logger_user_login_id = req.user.user_login_id;
            const attendance = await dashboardModel.attendance(logger_user_login_id);
        
            res.status(200).json({
                attendance:attendance.length > 0 ? attendance[0] : null, 
            });
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

}

module.exports = dashboardController;