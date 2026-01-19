import dotenv from "dotenv";
dotenv.config({ debug: true });
// import OpenAI from "openai";
import Groq from "groq-sdk";
//import { GoogleGenAI } from "@google/genai"


// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


// const getOpenAIAPIResponse = async (message) => {
//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/responses",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//           model: "gpt-4.1-mini",
//           input: message
//         })
//       }
//     );

//     const data = await response.json();

//     //  CRITICAL SAFETY CHECK
//     if (!data.output || !data.output[0]?.content?.[0]?.text) {
//       console.error("BAD OPENAI RESPONSE:", data);
//       throw new Error("Invalid OpenAI response structure");
//     }

//     return data.output[0].content[0].text;

//   } catch (err) {
//     console.error("OPENAI ERROR:", err.message);
//     return null;
//   }
// };

// export default getOpenAIAPIResponse;


// //import "dotenv/config";

// // const getOpenAIAPIResponse = async(message) => {
// //     const options = {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
// //         },
// //         body: JSON.stringify({
// //             model: "gpt-3.5-turbo",
// //             messages: [{
// //                 role: "user",
// //                 content: message
// //             }]
// //         // })
// //     };

// //     try {
// //         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
// //         const data = await response.json();
        
// //         //return data.output[0].content[0].text;
// //         return data.choices[0].message.content; //reply
// //     } catch(err) {
// //         console.log(err);
// //     }
// // }

// // export default getOpenAIAPIResponse;



// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const getGeminiResponse = async (message) => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       contents: message,
//     });

//     return response.text;
//   } catch (err) {
//     console.error("GEMINI ERROR:", err.message);
//     return null;
//   }
// };
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getGeminiResponse = async (message) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    });

    return chatCompletion.choices[0].message.content;
  } catch (err) {
    console.error("GROQ ERROR:", err.message);
    return null;
  }
};

export default getGeminiResponse;
