const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const formidable = require('formidable');

require('dotenv').config({ path: '../.env' });
const { MongoWrapper } = require('./mongowrapper');
const sendEmail = require("./mailjet");
const helpers = require("./helpers");

const app = express();
const port = 3000;

const db = new MongoWrapper();

app.use(cors());
app.use(bodyParser.json());

// START ENDPOITS FOR TICKET

app.post('/ticket', async (req, res) => {
    try {
        await db.connected;

        const newTicket = {
            "time-created": await helpers.getCurrentDate(),
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

        const { userId, email } = req.query; // Get userId and email from query (if provided)

        // Prepare an array of filters for $or query
        let filters = [];
        if (userId) {
            filters.push({ 'user.id': userId });
        }
        if (email) {
            filters.push({ 'user.email': email });
        }

        // If no filters are provided, return all tickets
        const result = await db.findWithOr('ticket', filters);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get tickets \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/tickets/agent', async (req, res) => {
    try {
        await db.connected;

        const { agentId, ticketStatus } = req.query;

        // Prepare an array of filters for $or query
        let filters = {};
        if (agentId) {
            filters['agent.id'] = agentId;
        }
        if (ticketStatus) {
            filters.status = ticketStatus;
        }

        console.log(filters)

        // If no filters are provided, return all tickets
        const result = await db.find('ticket', filters);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get tickets \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.patch('/ticket/:id', async (req, res) => {
    try {
        await db.connected;

        const ticketId = req.params.id;
        const updatedFields = req.body;

        if (updatedFields.status === "Closed") {
            updatedFields["time-closed"] = await helpers.getCurrentDate();
        } else {
            updatedFields["time-updated"] = await helpers.getCurrentDate();
        }

        const result = await db.updateOne("ticket", ticketId, updatedFields)
        // console.log(result)

        if (result.matchedCount > 0) {
            // res.json({ success: true, message: 'Ticket fields updated successfully' });
            const ticket = await db.findOne("ticket", {_id: ticketId});
            const email = ticket.user.email;
            const subject = `One of your tickets has been updated`;
            const text = `Hello! Ticket '${ticketId}' has had an update, login to see the change`;
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

app.post('/send-email', async (req, res) => {
    console.log(req.body)
    const { to, subject, text } = req.body;

    sendEmail(res, to, subject, text);
});

app.post('/recieve-email', async (req, res) => {
    const form = new formidable.IncomingForm();

    try {
        await db.connected;

        const { fields, files } = await helpers.parseFormAsync(req, form);

        // console.log(fields)

        if (fields.hasOwnProperty('headers[in_reply_to]') && fields['headers[in_reply_to]']) {
            // is a reply to an update email

            // Iterate through the plain text fields and try to extract the ticket ID
            let ticketId = null;
            fields.plain.forEach(text => {
                const extractedId = helpers.extractTicketId(text);
                if (extractedId) {
                    ticketId = extractedId;  // Assign the ticket ID if found
                }
            });

            console.log(fields)
            console.log(fields.reply_plain[0].split('\r\n')[0].trim())

            const updatedFields = {
                "time-updated": await helpers.getCurrentDate(),
                "comment": fields.reply_plain[0].split('\r\n')[0].trim()
            }

            const result = await db.updateOne("ticket", ticketId, updatedFields)
        } else {
            // is an email to create a new ticket
            const sender = fields['envelope[from]'][0];
            const subject = fields['headers[subject]'][0];
            const plainContent = fields.plain[0];

            const newTicket = {
                "time-created": await helpers.getCurrentDate(),
                "time-updated": "",
                "time-closed": "",
                "title": subject,
                "description": plainContent,
                "attatchments": {},
                "category": "",
                "status": "recieved",
                "agent": { 
                    "id": null,
                    "name": null
                },
                "actions": "",
                "comment": "",
                "user": {
                    "id": null,
                    "name": null,
                    "email": sender
                }
            };

            const result = await db.insertOne('ticket', newTicket);
            res.status(200).json({ success: true, result });
        }

    } catch (error) {
        console.error(`Error: can't update db with ticket \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});