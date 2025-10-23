import path from "path";
import dotenv from "dotenv";

dotenv.config()

class BaseConfig {
    // readonly routsPrefix = "/api/v1/";
    accessLogFile = __dirname + "\\..\\..\\logs\\accessLog.log";
    errorLogFile = path.resolve(__dirname, "..", "..", "logs", "errorLog.log");
    productImagesPrefix = path.resolve(__dirname, "..", "..", "assets", "images")
    tokenSecretKey = process.env.TOKEN_SECRET_KEY;
}

class DevConfig extends BaseConfig {
    DB_FILE = __dirname + "\\..\\..\\sqlite.db";
    port = 3030;
}

class ProdConfig extends BaseConfig {
    DB_FILE = __dirname + "\\..\\..\\prod_sqlite.db";
    port = 3033;
}

export const appConfig = Number(global.process.env.IS_PROD) === 1 ? new ProdConfig() : new DevConfig();


// export const productImagesPrefix = path.resolve(__dirname, "..", "..", "assets", "images")

// // export const tokenSecretKey = "@#RNSDVS*#$RTN#Vdfgve4rt8923f@4f34f823F@Wvsdr23SDCV@#RF#WEVsdfv";
// export const tokenSecretKey = process.env.TOKEN_SECRET_KEY;




// export const DB_FILE = __dirname + "\\..\\..\\sqlite.db"
// export const accessLogFile = __dirname + "\\..\\..\\logs\\accessLog.log";

// //// better to work with "resolve"
// // export const errorLogFile  = __dirname + "\\..\\..\\logs\\errorLog.log";
// export const errorLogFile = path.resolve(__dirname, "..", "..", "logs", "errorLog.log");

