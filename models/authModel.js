
const db = require('../config/db');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authModel = {
   login(params) {
    return new Promise(async (resolve, reject) =>{
        try{
            const {email_id, pass_word} = params;
            const [rows] = await db.execute('SELECT *, pass_word as encrypt_pass_word FROM user_login WHERE email_id = ? AND is_deleted = 0', [email_id]);

            const {user_login_id, user_name, m_user_type_id, encrypt_pass_word} = rows[0];

            const is_password_valid = await bcrypt.compare(pass_word, encrypt_pass_word);
            
            if(!is_password_valid){
                return reject('Password is incorrect');
            }

            let access_token  = jwt.sign({user_login_id, user_name, m_user_type_id}, process.env.JWT_TOKEN_SECRET, {'expiresIn':'1h'});
            let refresh_token  = jwt.sign({user_login_id, user_name, m_user_type_id}, process.env.JWT_REVERSE_TOKEN_SECRET, {'expiresIn':'2 days'});

            return resolve({access_token, refresh_token});
        }
        catch(err){
            return reject('User not found');
        }
    });
  
  },

}

module.exports = authModel;
