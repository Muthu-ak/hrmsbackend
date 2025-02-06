const nodemailer = require('nodemailer');
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM_ID,
        pass: process.env.EMAIL_PASS,
      },
});

async function emailTransport(to, subject, template, data) {
  
    try{

        const html = await ejs.renderFile(__dirname+`/views/${template}.ejs`,data,{async:true})

        await transporter.sendMail({
            from: process.env.EMAIL_FROM_ID, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            html: html // html body
        });
        return Promise.resolve(true);
    }
    catch(err){
        return Promise.reject(err);
    }
}

module.exports = {emailTransport};