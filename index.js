import express from "express";
import mongoose from "mongoose";
import { router as authRouter } from "./routers/authRouter.js";
import { PORT } from "./config.js";

mongoose
  .connect(
    "mongodb+srv://adminAdmin:XfAo51xBcUaBwApj@cluster0.epauii0.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();
app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`server started on port: ${PORT}`);
});
