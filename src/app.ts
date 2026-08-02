import express, {
    Application,
    Request,
    Response,
} from "express";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(
    "/api/payments/webhook",
    express.raw({
        type: "application/json",
    })
);

// JSON parser for all other API routes
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("FixItNow Server Running");
});

app.use("/api", router);


app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        errorDetails: {
            statusCode: 404,
        },
    });
});

// Global error handler must remain last
app.use(globalErrorHandler);

export default app;