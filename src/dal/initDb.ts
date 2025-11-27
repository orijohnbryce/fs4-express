import { MongoClient } from "mongodb";
import { dbCollection, dbHost, dbName } from "../config";


async function createDatabase(): Promise<void> {

    const client = new MongoClient(dbHost);

    await client.connect()

    const db = client.db(dbName) // use dbName
    
    const collection = db.collection(dbCollection);

    collection.createIndex({id: 1}, {unique: true})

    const note = {
        id: 1, 
        title: "note 1 title",
        content: "note 1 content",
        status: "ready"
    }

    await collection.insertOne(note);

    console.log("Success");
    
}

createDatabase();