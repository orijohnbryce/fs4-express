"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIt = logIt;
function logIt(msg_1) {
    return __awaiter(this, arguments, void 0, function* (msg, isError = false) {
        // const logDir = path.dirname(appConfig.accessLogFile);
        // await fsp.mkdir(logDir, {recursive: true})
        // if (!isError)
        //     await fsp.appendFile(appConfig.accessLogFile, `${msg}\n`);
        // else
        //     await fsp.appendFile(appConfig.errorLogFile, `${msg}\n`);
        console.log(msg);
    });
}
