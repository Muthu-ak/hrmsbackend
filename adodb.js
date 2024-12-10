const db = require('./config/db');
const moment = require('moment');
const bcrypt = require("bcrypt");

const adodb = {

    getColumnNames(tableName) {
        return new Promise(async (resolve, reject) =>{
            try {
                const [rows] = await db.query(`DESCRIBE ${tableName}`);
                const columnNames = rows.map(row => row.Field);
                return resolve(columnNames);
            } catch (err) {
                return reject(err.message);
            }
        });
    },

    checkRecord(table_name, primary_key, id) {
        return new Promise(async (resolve) =>{
            try {
                await db.query(`SELECT * FROM ${table_name} WHERE ${primary_key} = '${id}' LIMIT 1`);
                return resolve(1);
            } catch (err) {
                return resolve(0);
            }
        });
    },

    async insertSql(){
        try{
          const x = await this.getColumnNames('user_login');
          return x;
        }
        catch(err){
           return err
        }
    },

    async saveData(table_name, primary_key, data){
        try{
            let current_date_time = moment().format('YYYY-MM-DD hh:mm:ss');

            let id =  data.hasOwnProperty(primary_key) ? data[primary_key] : -1;

            let is_record = await this.checkRecord(table_name, primary_key, id);

            if(is_record == 1){
                // Update query
                data['updated_on'] = current_date_time;
                data['updated_by'] = data['current_user_login_id'];

            }
            else{
                //  Insert query

            }


        }
        catch(err){
           
        }
    }

}

module.exports = adodb;