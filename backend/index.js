const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoWrapper } = require('./mongowrapper');

const app = express();
const port = 3000;

const db = new MongoWrapper();

app.use(cors());
app.use(bodyParser.json());

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
            "description": req.body.description,
            "attatchments": {},
            "category": "",
            "status": "",
            "agent": null,
            "actions": "",
            "comment": ""
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
        const result = await db.find('ticket');
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get tickets \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/user', async (req, res) => {
    try {
        await db.connected;
        const result = await db.findOne('user', req.body.query);
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});