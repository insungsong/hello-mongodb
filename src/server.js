import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { userRouter, blogRouter, commentRouter } from "./routes/index.js";
// import { generateFakeData } from "../faker.js";
import { generateFakeData } from "../faker2.js";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

const server = async () => {
  try {
    // mongoose connection
    await mongoose.connect(process.env.MONGO_URL);

    // mock data created
    // generateFakeData(10, 10, 10);

    // mongoose debugMode on
    // mongoose.set("debug", true);
    console.log("🔐 MongoDB Connected!");

    // req는 문자열 value가 오니까 js가 parse해서 인지할 수 있도록 해당 코드 추가
    app.use(express.json());

    // routes
    app.use("/user", userRouter);
    app.use("/blog", blogRouter);
    app.use("/blog/:blogId/comment", commentRouter);

    // server listening
    app.listen(3000, async () => {
      console.log(`✅ listening server port ${3000}`);
      // ✅ faker 2
      // for (let i = 0; i <= 20; i++) {
      await generateFakeData(1, 1, 1);
      // }

      // ✅ faker 1
      // await generateFakeData(100000, 5, 10);
    });
  } catch (error) {
    console.log("error:", error);
    if (error) {
      console.log("error: ", error);
    }
  }
};

server();
