import express, { Application, Request, Response } from "express";
import router from "./app/routes";
const app: Application = express();

app.get("/", (req: Request, res: Response) => {
    res.send("FixItNow Server Running");
});




app.use("/api/v1", router);

export default app;