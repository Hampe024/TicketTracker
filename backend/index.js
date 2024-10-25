const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: '../.env' });
const { MongoWrapper } = require('./mongowrapper');
const sendEmail = require("./mailjet");
const helpers = require("./helpers");

const app = express();
const port = 3000;

const db = new MongoWrapper();

app.use(cors());
app.use(bodyParser.json());




const multer = require('multer');

// Set storage to memory (files will be stored in memory buffer, which can be saved directly to MongoDB)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit files to 5MB
        files: 5 // Max number of files
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('File type not supported'));
        }
    }
}).array('attachments', 5); // 'files' is the field name for the file input in the form




// START ENDPOITS FOR TICKET

app.post('/ticket', upload, async (req, res) => {
    try {
        await db.connected;

        const attachments = req.files.map(file => ({
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer // Store file content as Buffer
        }));

        console.log(req.body)

        const newTicket = {
            "time-created": await helpers.getCurrentDate(),
            "time-updated": "",
            "time-closed": "",
            "title": req.body.title,
            "description": req.body.description,
            "attachments": attachments, // Include uploaded files
            "category": req.body.category ? req.body.category : "",
            "status": "recieved",
            "agent": {
                "id": null,
                "name": null
            },
            "comment": [],
            "user": JSON.parse(req.body.user) // Parse user as it's sent as JSON string in FormData
        };

        const result = await db.insertOne('ticket', newTicket);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't insert ticket: to db \n${error}`);
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
            const subject = `Your ticket '${ticket.title}' has had an update`;
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

// START ENDPOINTS FOR CATEGORIES

app.get('/categories', async (req, res) => {
    try {
        await db.connected;
        const result = await db.find('category');
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get categories \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/category', async (req, res) => {
    try {
        await db.connected;

        console.log(req.body)

        const category = req.body;

        const result = await db.insertOne('category', category);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't create category \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

// START ENDPOITS FOR USER

app.get('/user', async (req, res) => {
    try {
        await db.connected;
        const query = JSON.parse(req.query.query);
        const result = await db.findOne('user', query);

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't get users \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/user/login', async (req, res) => {
    try {
        await db.connected;

        const query = JSON.parse(req.query.email);
        const result = await db.findOne('user', query);

        if (!result) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(req.query.password, result.password);

        if (!isMatch) {
            console.error(`Login failed: Incorrect password(${req.query.password}) for email ${req.query.email}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't login \n${error}`);
        res.status(500).json({ success: false, error: 'An error occurred during login' });
    }
});

app.post('/user', async (req, res) => {
    try {
        await db.connected;

        // console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = {
            "name": req.body.name,
            "email": req.body.email,
            "role": req.body.role, // "customer" or "agent" or "admin"
            "password": hashedPassword,
            "firstTimeLogin": req.body.firstTimeLogin
        }
        const result = await db.insertOne('user', newUser);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error(`Error: can't create user:${newUser} \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.patch('/user/:id', async (req, res) => {
    try {
        await db.connected;

        const userId = req.params.id;
        const updatedFields = req.body;
        if (updatedFields.hasOwnProperty('password')) {
            const hashedPassword = await bcrypt.hash(updatedFields.password, 10);
            updatedFields.password = hashedPassword;
        }

        const result = await db.updateOne("user", userId, updatedFields)

        if (result.matchedCount > 0) {
            res.status(200).json({ success: true, result });
        } else {
            res.status(404).json({ success: false, message: 'could not find user' });
        }
        
    } catch (error) {
        console.error(`Error updating user: ${error}`);
        res.status(500).json({ success: false, message: 'could not update user' });
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

            // console.log(fields)
            // console.log(typeof(fields.reply_plain[0]))
            // console.log(fields.reply_plain[0].split('\n')[0].trim())

            const ticket = await db.findOne("ticket", {"_id": ticketId});
            const oldComments = ticket.comment;
            const commentText = fields.reply_plain[0].split('\n')[0].trim();
            const newComment = {
                "time": await helpers.getCurrentDate(),
                "msg": commentText,
                "sender": "customer"
            }
            const totComments = [...oldComments, newComment];

            const updatedFields = {
                "time-updated": await helpers.getCurrentDate(),
                "comment": totComments
            }

            const result = await db.updateOne("ticket", ticketId, updatedFields)
        } else {
            // is an email to create a new ticket
            const sender = fields['envelope[from]'][0];
            const subject = fields['headers[subject]'][0];
            const plainContent = fields.plain[0];

            const bthDomainPattern = /@bth\.se$/;
            const studentBthPattern = /@student\.bth\.se$/;
            const gmailPattern = /@gmail\.com$/;

            let newTicket = {};

            if (bthDomainPattern.test(sender) || studentBthPattern.test(sender) || gmailPattern.test(sender)) {
                console.log("is either bth or gmail domain")
                try {
                    const hashedPassword = await bcrypt.hash("password", 10);
                    const name = fields['headers[from]'][0].split(' <')[0];
            
                    const newUser = {
                        "name": name,
                        "email": sender,
                        "role": "customer",
                        "password": hashedPassword,
                        "firstTimeLogin": true
                    }
                    const userResult = await db.insertOne('user', newUser);
                    const user = await db.findOne('user', {"_id": userResult.insertedId});
                    console.log(user);

                    newTicket = {
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
                        "comment": [],
                        "user": {
                            "id": user._id,
                            "name": user.name,
                            "email": user.email
                        }
                    };
                    const result = await db.insertOne('ticket', newTicket);
                    const emailSubject = "Your ticket has been submitted";
                    const emailText = "Thank you for submitting a ticket!\n\nYou will get updated to this email when the ticket gets updated.\n\nIf you did not have an account one has been created for you, log in with this email and the password 'password', there you will be promted to change the password.";
                    sendEmail(res, user.email, emailSubject, emailText);
                } catch (error) {
                    console.error(`Error: can't create user:${newUser} \n${error}`);
                }
            } else {
                newTicket = {
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
                    "comment": [],
                    "user": {
                        "id": null,
                        "name": null,
                        "email": sender
                    }
                };
                const result = await db.insertOne('ticket', newTicket);
                res.status(200).json({ success: true, result });
            }

            
        }

    } catch (error) {
        console.error(`Error: can't update db with ticket \n${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});