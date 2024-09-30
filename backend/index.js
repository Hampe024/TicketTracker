const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config({ path: '../.env' });
const { MongoWrapper } = require('./mongowrapper');
const sendEmail = require("./mailjet");
const mailjet = require('node-mailjet').apiConnect(process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);

const app = express();
const port = 3000;

const db = new MongoWrapper();

function getCurrentDate() {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    return `${hours}:${minutes}:${seconds} - ${day} - ${month} - ${year}`;
}

app.use(cors());
app.use(bodyParser.json());

// START ENDPOITS FOR TICKET

app.post('/ticket', async (req, res) => {
    try {
        await db.connected;

        const newTicket = {
            "time-created": getCurrentDate(),
            "time-updated": "",
            "time-closed": "",
            "title": req.body.title,
            "description": req.body.description,
            "attatchments": {},
            "category": req.body.category ? req.body.category : "",
            "status": "recieved",
            "agent": { 
                "id": null,
                "name": null
            },
            "actions": "",
            "comment": "",
            "user": req.body.user
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
        const query = userId ? { user: { "id": userId, "name": "John Doe" }} : {};

        const result = await db.find('ticket', query);
        // console.log(result)

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get tickets \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.patch('/ticket/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const updatedFields = req.body;

        updatedFields["time-updated"] = getCurrentDate();

        const result = await db.updateOne("ticket", ticketId, updatedFields)
        // console.log(result)

        if (result.matchedCount > 0) {
            // res.json({ success: true, message: 'Ticket fields updated successfully' });
            const email = 'hampe024@gmail.com';
            const subject = `Ticket ${ticketId} has been updated`;
            const text = `Hello! One of your tickets has been updated, login to see the change`;
            sendEmail(res, email, subject, text);
        } else {
            res.status(404).json({ success: false, message: 'Ticket not found or not updated' });
        }
        
    } catch (error) {
        console.error(`Error updating ticket: ${error}`);
        res.status(500).json({ success: false, message: 'Failed to update ticket' });
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

    sendEmail(res, to, subject, text);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});