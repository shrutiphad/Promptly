import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from './utils.js';
import { ToastContainer } from 'react-toastify';
import "./Login.css"
function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    // const getReply = async () => {
    //     if (!prompt.trim()) return;
    //     setLoading(true);
    //     setNewChat(false);

    //     console.log("message ", prompt, " threadId ", currThreadId);
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             message: prompt,
    //             threadId: currThreadId
    //         })
    //     };

    //     try {
    //         const response = await fetch("http://localhost:8080/api/chat", options);
    //         const headers = {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             }
    //         };
    //         const res = await response.json();
    //         console.log(res);
    //         setReply(res.reply);
    //     } catch (err) {
    //         console.log(err);
    //     }
    //     setLoading(false);
    // }

    const getReply = async () => {
        if (!prompt.trim()) return;
      
        setLoading(true);
        setNewChat(false);
      
        try {
          const response = await fetch("http://localhost:8080/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              message: prompt,
              threadId: currThreadId,
            }),
          });
      
          const res = await response.json();
          console.log(res);
      
          if (!response.ok) throw new Error(res.message);
      
          setReply(res.reply);
        } catch (err) {
          console.log(err);
        }
      
        setLoading(false);
      };
      
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                }, {
                    role: "assistant",
                    content: reply
                }]
            ));
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <div className="chatWindow">
                <div className="navbar">
                    <span><h2>Promptly</h2></span>
                    <div className="userIconDiv" onClick={handleProfileClick}>
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                </div>

                {isOpen && (
                    <div className="dropDown">
                        <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                        <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                        <div className="dropDownItem-logout"> <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            <button className='logout' onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                )}

                <Chat />
                <ScaleLoader color="#fff" loading={loading} />

                <div className="chatInput">
                    <div className="inputBox">
                        <input
                            placeholder="Ask anything"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                        />
                        <div id="submit" onClick={getReply}>
                            <i className="fa-solid fa-paper-plane"></i>
                        </div>
                    </div>

                    <p className="info">
                        Promptly can make mistakes. Check important info. See Cookie Preferences.
                    </p>
                </div>
            </div>
        </>
    )
}

export default ChatWindow;
