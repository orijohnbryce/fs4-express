import { MongoClient } from "mongodb";
import { dbCollection, dbHost, dbName } from "../config";


export const client = new MongoClient(dbHost);
client.connect();

const db = client.db(dbName);
export const collection = db.collection(dbCollection);