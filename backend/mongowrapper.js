const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";

class MongoWrapper {

    constructor() {
        this.client = null;
        this.connected = this.connect();
        this.db = "testdb";
    }

    async connect() {
        try {
            this.client = new MongoClient(uri);
            await this.client.connect();
            console.log("DB connection successful");
        } catch (e) {
            console.warn("DB connection failed", e);
        }
    }

    async getCollection(collectionName) {
        const db = this.client.db(this.db);
        return db.collection(collectionName);
    }

    async insertOne(collectionName, document) {
        const collection = await this.getCollection(collectionName);
        return collection.insertOne(document);
    }

    async find(collectionName) {
        const collection = await this.getCollection(collectionName);
        return collection.find().toArray();
    }
}

module.exports = { MongoWrapper };