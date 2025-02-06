const ExcelJS = require('exceljs');

const font = {
    color: { argb: 'FFFFFF' }, // Font color: white
    bold: true, // Bold font
    size: 12 // Font size
};
const fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '2e2e2e' } // Background color: light blue
};

const excelController = {
    async holiday(req, res){
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Holiday');

            worksheet.columns = [
                {header:"S.No", key:'s_no', width:10},
                {header:"Title", key:'holiday_title', width:40},
                {header:"Date", key:'holiday_date', width:20},
                {header:"Day", key:'holiday_day', width:20},
            ];

            worksheet.addRows(req.excelData.data);

            const headerRow = worksheet.getRow(1);

            headerRow.eachCell((cell) => {
                cell.font = font;
                cell.fill = fill;
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.setHeader('Content-Disposition', 'attachment; filename=holiday.xlsx');
            res.send(buffer);

        } catch (err) {
            res.status(500).json({ error: 'Excel Error' });
        }
    },
    async leaveType(req, res){
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Leave Types');

            worksheet.columns = [
                {header:"S.No", key:'s_no', width:10},
                {header:"Leave Type", key:'leave_type', width:40},
                {header:"Number of days", key:'no_of_days', width:20},
            ];

            worksheet.addRows(req.excelData.data);

            const headerRow = worksheet.getRow(1);

            headerRow.eachCell((cell) => {
                cell.font = font;
                cell.fill = fill;
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.setHeader('Content-Disposition', 'attachment; filename=leavetypes.xlsx');
            res.send(buffer);

        } catch (err) {
            res.status(500).json({ error: 'Excel Error' });
        }
    },
    async clients(req, res){
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Clients');

            worksheet.columns = [
                {header:"S.No", key:'s_no', width:10},
                {header:"Clients Name", key:'client_name', width:40},
                {header:"Contact Person Name", key:'contact_person_name', width:40},
                {header:"Contact Number", key:'contact_no', width:20},
                {header:"Email ID", key:'email_id', width:30},
            ];

            worksheet.addRows(req.excelData.data);

            const headerRow = worksheet.getRow(1);

            headerRow.eachCell((cell) => {
                cell.font = font;
                cell.fill = fill;
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.setHeader('Content-Disposition', 'attachment; filename=clients.xlsx');
            res.send(buffer);

        } catch (err) {
            res.status(500).json({ error: 'Excel Error' });
        }
    },
    async projects(req, res){
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Projects');

            worksheet.columns = [
                {header:"S.No", key:'s_no', width:10},
                {header:"Project Name", key:'project_name', width:40},
                {header:"Client Name", key:'client_name', width:20},
                {header:"Project Manager", key:'project_manager', width:20},
                {header:"Start Date", key:'start_date', width:15},
                {header:"End Date", key:'end_date', width:15},
                {header:"Project Value", key:'project_value', width:15},
                {header:"Status", key:'project_status', width:15},
                {header:"Description", key:'project_description', width:100},
            ];

            worksheet.addRows(req.excelData.data);

            const headerRow = worksheet.getRow(1);

            headerRow.eachCell((cell) => {
                cell.font = font;
                cell.fill = fill;
            });

            worksheet.eachRow((row, rowIndex) => {
                row.eachCell((cell) => {
                    cell.alignment = { wrapText: true, vertical: 'middle' };
                });
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.setHeader('Content-Disposition', 'attachment; filename=projects.xlsx');
            res.send(buffer);

        } catch (err) {
            res.status(500).json({ error: 'Excel Error' });
        }
    },
}

module.exports = excelController;