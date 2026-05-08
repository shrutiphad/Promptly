import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "./utils.js";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://promptly-ezg2.onrender.com";


function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser") || "Shruti");
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");

    handleSuccess("User logged out");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const getReply = async () => {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt || loading) return;

    // setLoading(true);
    // setNewChat(false);

    const token = localStorage.getItem("token");
    
    if (!token) {
      handleError("Please login again");
       navigate("/login");
       return;
    }
    
    setLoading(true);
    setNewChat(false);
    setReply(null);
    
    // try {
    //   const response = await fetch("https://promptly-ezg2.onrender.com", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //     body: JSON.stringify({
    //       message: cleanPrompt,
    //       threadId: currThreadId,
    //     }),
    //   });


  //   try {
  //         const response = await axios.post(
  //           `${API_URL}/api/chat`,
  //           {
  //             message: cleanPrompt,
  //             threadId: currThreadId,
  //           },
  //           {
  //             headers: getAuthHeaders(),
  //           }
  //         );
    

  //     const res = await response.data;
  //     if (!res.ok) throw new Error(res.message || "Unable to get reply");

  //     setReply(res.reply);
  //   } catch (err) {
  //     console.log(err);
  //     handleError(err.message || "Server error. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (prompt && reply) {
  //     setPrevChats((prevChats) => [
  //       ...prevChats,
  //       { role: "user", content: prompt },
  //       { role: "assistant", content: reply },
  //     ]);
  //   }
  //   setPrompt("");
  // }, [reply]);

  
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: cleanPrompt,
        },
      ]);
  
      setPrompt("");
  
    try {
      const response = await axios.post(
        `${API_URL}/api/chat`,
        {
          message: cleanPrompt,
          threadId: currThreadId,
        },
        {
          headers: getAuthHeaders(),
        }
      );
  
      const aiReply = response.data?.reply;
  
      if (!aiReply) {
        throw new Error("Server did not return a reply");
      }
  
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "assistant",
          content: aiReply,
        },
      ]);
  
      setReply(aiReply);
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Server error. Please try again.";
  
      handleError(backendMessage);
      console.error("Chat error:", err);
    

    setPrevChats((prevChats) => [
      ...prevChats,
      {
        role: "assistant",
        content: "Sorry, I could not reach the server. Please try again.",
      },
    ]);
  } finally {
    setLoading(false);
  }
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getReply();
    }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <div className="navbar-left">
          <span className="chat-status-dot"></span>
          <div>
            <h2 className="navbar-title">Promptly</h2>
            <span className="navbar-subtitle">Ask, debug, write, solve</span>
          </div>
        </div>

        <div className="userIconDiv">
          <span className="userIcon" onClick={() => setIsOpen((prev) => !prev)}>
            {(loggedInUser || "P").charAt(15).toUpperCase()} P
          </span>

          {isOpen && (
            <div className="dropDown">
              <div className="dropDownItem">⚙ Settings</div>
              <div className="dropDownItem">✦ Upgrade plan</div>
              <div className="dropDownItem-logout">
                ↳
                <button type="button" className="logout" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="chat-main-area">
        <Chat />
      </main>

      <div className="loaderRow">
        <ScaleLoader color="#7c6ef1" height={14} width={3} radius={3} loading={loading} />
      </div>

      <div className="chatInput">
        <div className="inputBox">
          <input
            className="prompt-input"
            placeholder="Ask anything…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            id="submit"
            className={!prompt.trim() || loading ? "is-disabled" : ""}
            onClick={getReply}
            disabled={!prompt.trim() || loading}
          >
            <span className="send-arrow">→</span>
          </button>
        </div>

        <p className="info">Promptly may produce errors. Verify important information before using it.</p>
      </div>
      <ToastContainer />
    </div>
  );
    }

    export default ChatWindow;
