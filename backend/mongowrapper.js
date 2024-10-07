const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://127.0.0.1:27017";

class MongoWrapper {

    constructor() {
        this.client = null;
        this.connected = this.connect();
        this.db = "testdb5";
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

    async find(collectionName, filter = {}) {
        const collection = await this.getCollection(collectionName);
        return collection.find(filter).toArray();
    }

    async findWithOr(collectionName, filters = []) {
        const collection = await this.getCollection(collectionName);
    
        // Check if we have any filters provided
        if (filters.length === 0) {
            return collection.find().toArray(); // No filters, return all documents
        }
    
        // Create an OR query if filters are provided
        const orQuery = { $or: filters };
    
        return collection.find(orQuery).toArray();
    }

    async findOne(collectionName, query) {
        if (query.hasOwnProperty('_id')) {
            query._id = new ObjectId(query._id);
          }
        const collection = await this.getCollection(collectionName);
        return collection.findOne(query);
    }

    async deleteOne(collectionName, id) {
        const collection = await this.getCollection(collectionName);
        try {
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 1) {
                console.log(`Successfully deleted document with _id: ${id}`);
            } else {
                console.log(`No document found with _id: ${id}`);
            }
            return result;
        } catch (e) {
            console.error("Error deleting document", e);
            throw e;  // Ensure error bubbles up to the API endpoint
        }
    }

    async updateOne(collectionName, id, update) {
        const collection = await this.getCollection(collectionName);
        return collection.updateOne({ _id: new ObjectId(id) }, { $set: update });
      }
}

module.exports = { MongoWrapper };