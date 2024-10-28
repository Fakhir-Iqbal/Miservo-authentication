import express from "express";
import mongoose from "mongoose";
import chalk from "chalk";
import routes from "./src/routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import { checkReq } from "./src/utils/index.js";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

// .env configuration
dotenv.config();

// CORS Policy defined
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: false,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.set("port", process.env.PORT || 4000);

// connection mongodb
const mongoURI = process.env.MONGO_URI ;

mongoose
  .connect(mongoURI)
  .then(() =>
    console.log(chalk.white.bgGreen("---- Connected to MongoDB ----"))
  )
  .catch((err) =>
    console.log(chalk.white.bgRed("---- Error Connected MongoDB ----", err))
  );
// connection mongodb

// root path for testing with success response
app.get("/", checkReq);

// api path for operations
app.use("/api", routes);

// on other routes which doesn't exist
app.get("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: ReasonPhrases.NOT_FOUND });
});

// listening port
app.listen(app.get("port"), () =>
  console.log(chalk.white.bgBlue("Server started on port " + app.get("port")))
);