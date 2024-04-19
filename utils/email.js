const { text } = require('body-parser');
const nodemailer = require('nodemailer');

const sendEmail = async (option) => {

    //CREATE A TRANSPORTER
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PWD
        }
    })

    // DEFINE EMAIL OPTIONS
    const emailOptions = {
        from: 'Showcase Support<support@showcase.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions);
}


module.exports = sendEmail;