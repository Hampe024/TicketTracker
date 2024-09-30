const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config({ path: '../.env' });
const { MongoWrapper } = require('./mongowrapper');
const mailjet = require('node-mailjet').connect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);

const app = express();
const port = 3000;

const db = new MongoWrapper();

app.use(cors());
app.use(bodyParser.json());

// START ENDPOITS FOR TICKET

app.post('/ticket', async (req, res) => {
    try {
        await db.connected;

        const currentDate = new Date();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        const newTicket = {
            "time-created": `${hours}:${minutes}:${seconds} - ${day} - ${month} - ${year}`,
            "time-closed": "",
            "title": req.body.title,
            "description": req.body.description,
            "attatchments": {},
            "category": req.body.category ? req.body.category : "",
            "department": req.body.department ? req.body.department : "",
            "status": "recieved",
            "agent": null,
            "actions": "",
            "comment": "",
            "userId": req.body.userId
        }
        const result = await db.insertOne('ticket', newTicket);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't insert ticket:${newTicket} to db \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/tickets', async (req, res) => {
    try {
        await db.connected;

        const { userId } = req.query; // get userId from query (if provided) and return only tickets for given user
        const query = userId ? { userId: userId } : {};

        const result = await db.find('ticket', query);

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get tickets \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

// START ENDPOITS FOR USER

app.get('/user', async (req, res) => {
    try {
        const query = JSON.parse(req.query.query);
        await db.connected;
        const result = await db.findOne('user', query);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get users \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/user', async (req, res) => {
    try {
        await db.connected;

        console.log(req.body)

        const newUser = {
            "name": req.body.name,
            "email": req.body.email,
            "role": req.body.role, // "customer" or "agent"
        }
        const result = await db.insertOne('user', newUser);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't create user:${newUser} \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/user', async (req, res) => {
    try {
        await db.connected;

        const userId = req.body.userId;
        const result = await db.deleteOne('user', userId);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't delete user ${userId} \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        await db.connected;
        const result = await db.find('user');
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get users \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

// START ENDPOITS FOR EMAIL

app.post('/send-email', (req, res) => {
    console.log(req.body)
    const { to, subject, text } = req.body;
    const sendEmail = (to, subject, text) => {
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [{
                    From: {
                        Email: 'hampe0246@gmail.com',
                        Name: 'Your Name',
                    },
                    To: [{
                        Email: to,
                        Name: 'Recipient Name',
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
    sendEmail(to, subject, text);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});