import path from "path";

export const DB_FILE = __dirname + "\\..\\..\\sqlite.db"
export const accessLogFile = __dirname + "\\..\\..\\logs\\accessLog.log";

//// better to work with "resolve"
// export const errorLogFile  = __dirname + "\\..\\..\\logs\\errorLog.log";
export const errorLogFile = path.resolve(__dirname, "..", "..", "logs", "errorLog.log");



export const tokenSecretKey = "@#RNSDVS*#$RTN#Vdfgve4rt8923f@4f34f823F@Wvsdr23SDCV@#RF#WEVsdfv";
