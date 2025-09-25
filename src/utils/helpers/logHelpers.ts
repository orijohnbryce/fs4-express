import { promises as fsp } from "fs";
import { accessLogFile, errorLogFile } from "../config";


export async function logIt(msg: string, isError=false) {
    if (!isError)
        await fsp.appendFile(accessLogFile, `${msg}\n`);
    else
        await fsp.appendFile(errorLogFile, `${msg}\n`);

    console.log(msg);    
}