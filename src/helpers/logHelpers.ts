import { promises as fsp } from "fs";
import { logFile } from "../config";

export async function logIt(msg: string) {
    await fsp.appendFile(logFile, `${msg}\n`);
}