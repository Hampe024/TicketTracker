const express = require('express');
const bodyParser = require('body-parser');
const { MongoWrapper } = require('./mongowrapper');

const app = express();
const port = 3000;

const db = new MongoWrapper();

app.use(bodyParser.json());

app.get('/testadd', async (req, res) => {
    try {
        await db.connected;
        const document = { name: "Test3", age: 27 };
        const result = await db.insertOne('testcollection', document);
        
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Error inserting document:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});