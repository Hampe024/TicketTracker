require('dotenv').config({ path: '../.env' });
const mailjet = require('node-mailjet').apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);

function sendEmail(res, to, subject, text) {
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [{
                From: {
                    Email: process.env.MAILJET_SEND_EMAIL,
                    Name: 'TicketTracker',
                },
                To: [{
                    Email: to,
                    Name: '',
                }],
                Subject: subject,
                TextPart: text,
            }],
        });
  
    request
        .then(result => {
            console.log(result.body);
            res.status(200).json({ success: true, result: result.body });
        })
        .catch(error => {
            console.error(`Error: can't send email \n${error}`);
            res.status(500).json({ success: false, error: error.message });
        });
};

module.exports = sendEmail;