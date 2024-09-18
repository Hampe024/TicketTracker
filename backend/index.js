// Import the MongoDB driver
const { MongoClient } = require('mongodb');

// Connection URI (assuming MongoDB is running locally in WSL2)
const uri = "mongodb://127.0.0.1:27017";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // Choose the database and collection
    const database = client.db('testdb');
    const collection = database.collection('testcollection');

    // Insert a document into the collection
    const result = await collection.insertOne({ name: "Test", age: 25 });
    console.log(`Document inserted with _id: ${result.insertedId}`);

    // Find the inserted document
    const foundDocument = await collection.findOne({ name: "Test" });
    console.log('Found document:', foundDocument);
    
  } finally {
    // Ensure the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
