import path from "path";
import dotenv from "dotenv";

dotenv.config()

class BaseConfig {
    // readonly routsPrefix = "/api/v1/";
    accessLogFile = __dirname + "\\..\\..\\logs\\accessLog.log";
    errorLogFile = path.resolve(__dirname, "..", "..", "logs", "errorLog.log");
    productImagesPrefix = path.resolve(__dirname, "..", "..", "assets", "images")
    tokenSecretKey = process.env.TOKEN_SECRET_KEY;

    // DB config:
    DB_USER = "app";
    DB_PASSWORD = "app123";
    DB_HOST = "localhost";
    DB_PORT = 5432
    DB_NAME = "appdb";

    DB_URL = `postgres://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DB_NAME}`
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

