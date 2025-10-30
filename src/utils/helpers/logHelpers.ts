import { promises as fsp } from "fs";
// import { accessLogFile, errorLogFile } from "../config";
import path from "path";
import { appConfig } from "../config";


export async function logIt(msg: string, isError=false) {

    // const logDir = path.dirname(appConfig.accessLogFile);
    // await fsp.mkdir(logDir, {recursive: true})

    // if (!isError)
    //     await fsp.appendFile(appConfig.accessLogFile, `${msg}\n`);
    // else
    //     await fsp.appendFile(appConfig.errorLogFile, `${msg}\n`);

    console.log(msg);    
}