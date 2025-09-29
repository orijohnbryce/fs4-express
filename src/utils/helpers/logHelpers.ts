import { promises as fsp } from "fs";
import { accessLogFile, errorLogFile } from "../config";
import path from "path";


export async function logIt(msg: string, isError=false) {

    const logDir = path.dirname(accessLogFile);
    await fsp.mkdir(logDir, {recursive: true})

    if (!isError)
        await fsp.appendFile(accessLogFile, `${msg}\n`);
    else
        await fsp.appendFile(errorLogFile, `${msg}\n`);

    console.log(msg);    
}