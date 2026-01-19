import dotenv from "dotenv";
dotenv.config({ debug: true });
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
//import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use("/api", authRoutes);
app.use("/api" ,chatRoutes);


const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch(err) {
        console.log("Failed to connect with Db", err);
    }
}

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    connectDB();
});



  
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

// async function main() {
//   const response = await ai.models.generateContent({
//     model: 'gemini-2.5-flash',
//     contents: 'Why is the sky blue?',
//   });
//   console.log(response.text);
// }

// main();

// app.post("/test", async (req, res) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages: [{
//                 role: "user",
//                 content: req.body.message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         //console.log(data.choices[0].message.content); //reply
//         res.send(data.choices[0].message.content);
//     } catch(err) {
//         console.log(err);
//     }
// });
