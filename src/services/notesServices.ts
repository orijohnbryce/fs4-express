import { collection } from "../dal/dal";
import Note from "../models/NoteModel";


export async function createNote(note: Note): Promise<string> {
    try {

        const result = await collection.insertOne(note)
        console.log(result);
        console.log(String(result.insertedId));
        return String(result.insertedId)
    } catch (error) {
        console.log(error);
    }
}

export  async function getNotes(id?: number) {
    let result: any;
    if (id) {
        result = await collection.findOne({ id: id })
    } else {
        result = await collection.find({}).toArray()
    }

    console.log(result);
    return result

}

export  async function updateNote(id: number, data: Partial<Note>): Promise<void> {
    await collection.updateOne({id: id}, {$set: data})
}

export async function deleteNote(id: number) {
    try {
        await collection.deleteOne({id: id})
        console.log("Deleted!");
        
    } catch (error) {
        console.log(error);
        
    }
}

// createNote({ id: 3, title: "title 3", content: "cont 3", status: "ready" })
// getNotes(3)
// updateNote(3, {title: "new title 3"});
// deleteNote(3)