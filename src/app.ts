import express, { NextFunction, Request, Response } from "express"
import { openDb, runQuery } from "./dal/dal";
import { productRoutes } from "./controllers/productControllers";
import { orderRoutes } from "./controllers/orderControllers";
import { errorHandler } from "./middlewares/errorHandler";
import { logMiddleware } from "./middlewares/logMiddleware";
import { authRouter } from "./controllers/userControllers";
import fileUpload from "express-fileupload";
import { queryGemini } from "./services/aiService";

const server = express();

// CORS allow to all
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

server.use(express.json()); // load body into "request" object
server.use(fileUpload())
server.use(logMiddleware)

server.post("/prompt", async (req: Request, res: Response, next: NextFunction) => {
    const prompt = req.body.prompt;
    const aiResponse = await queryGemini(prompt)
    res.json(aiResponse)
})

server.use(productRoutes);
server.use(orderRoutes);
server.use(authRouter);

server.use(errorHandler);

server.listen(3030, () => console.log("Express server started.\nhttp://localhost:3030"));
