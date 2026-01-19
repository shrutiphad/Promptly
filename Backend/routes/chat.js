import express from "express";
import Thread from "../models/Thread.js";
//import getOpenAIAPIResponse from "../utils/openai.js";
import getGeminiResponse from "../utils/openai.js";
import ensureAuthenticated from "../middleware/authMiddleware.js";

const router = express.Router();

//test
// router.post("/redirect", ensureAuthenticated, async (req, res) => {
//     try {
//       const threads = await Thread.find({ userId: req.user.id })
//         .sort({ updatedAt: -1 });
  
//       return res.json({
//         success: true,
//         user: req.user,
//         threads,
//       });
//     } catch (err) {
//       console.log(err);
//       return res.status(500).json({ error: "Failed to redirect user" });
//     }
//   });
  


//Get all threads to display
router.get("/thread", ensureAuthenticated, async (req, res) => {
    console.log('loged in user', req.user);
    try {
        const threads = await Thread.find({ userId: req.user.id })
        .sort({ updatedAt: -1 });
        //descending order of updatedAt  most recent data on top
        res.json(threads);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", ensureAuthenticated ,async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId , userId: req.user.id });

        if(!thread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.json(thread.messages);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", ensureAuthenticated, async (req, res) => {
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId,userId: req.user.id });

        if(!deletedThread) {
            res.status(404).json({error: "Thread not found"});
        }

        res.status(200).json({success : "Thread deleted successfully"});

    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

router.post("/chat", ensureAuthenticated,async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || !message) {
        res.status(400).json({error: "missing required fields"});
    }

    try {
        let thread = await Thread.findOne({threadId ,userId: req.user.id});

        if(!thread) {
            //create a new thread in Db
            thread = new Thread({
                threadId,
                title: message,
                userId: req.user.id, 
                messages: [{role: "user", content: message}]
            });
        } else {
            thread.messages.push({role: "user", content: message});
        }

        //const assistantReply = await getOpenAIAPIResponse(message);

        const assistantReply = await getGeminiResponse(message);

                    if (!assistantReply) {
            return res.status(500).json({
                error: "OpenAI failed to respond"
            });
            }
            
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();
        return res.json({reply: assistantReply});
    } catch (err) {
    console.error("CHAT ERROR:", err.message);
    console.error(err.stack);
    return res.status(500).json({
        error: "something went wrong",
        details: err.message
    });
}

});




export default router;