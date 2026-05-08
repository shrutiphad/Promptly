import "./Sidebar.css";
import { useCallback, useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://promptly-ezg2.onrender.com";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const getAllThreads = useCallback(
    async (signal) => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAllThreads([]);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/thread`, {
          signal,
          headers: getAuthHeaders(),
        });

        const threads = Array.isArray(response.data) ? response.data : [];

        const filteredData = threads.map((thread) => ({
          threadId: thread.threadId,
          title: thread.title || "Untitled chat",
        }));

        setAllThreads(filteredData);
      } catch (err) {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") return;

        console.error(
          "Failed to load threads:",
          err.response?.data?.message || err.message
        );
      }
    },
    [setAllThreads]
  );

  useEffect(() => {
    const controller = new AbortController();

    getAllThreads(controller.signal);

    return () => controller.abort();
  }, [currThreadId, getAllThreads]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    if (!newThreadId || newThreadId === currThreadId) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setAllThreads([]);
      return;
    }

    setCurrThreadId(newThreadId);

    try {
      const response = await axios.get(`${API_URL}/api/thread/${newThreadId}`, {
        headers: getAuthHeaders(),
      });

      const chats = Array.isArray(response.data) ? response.data : [];

      setPrevChats(chats);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error(
        "Failed to open thread:",
        err.response?.data?.message || err.message
      );
    }
  };

  const deleteThread = async (threadId) => {
    if (!threadId) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setAllThreads([]);
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/thread/${threadId}`, {
        headers: getAuthHeaders(),
      });

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error(
        "Failed to delete thread:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <section className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-logo">P</div>
          <div className="sidebar-brand-text">
            <span className="sidebar-title">Promptly</span>
            <span className="sidebar-subtitle">AI workspace</span>
          </div>
        </div>

        <button type="button" className="new-chat-btn" onClick={createNewChat}>
          <span className="new-chat-btn-left">
            <span>＋</span>
            New chat
          </span>
          <span>✎</span>
        </button>
      </div>

      <div className="history-wrapper">
        <div className="history-label">Recent</div>

        {allThreads?.length ? (
          <ul className="history">
            {allThreads.map((thread) => (
              <li
                key={thread.threadId}
                onClick={() => changeThread(thread.threadId)}
                className={thread.threadId === currThreadId ? "highlighted" : ""}
              >
                <span className="thread-icon">💬</span>
                <span className="thread-title">{thread.title}</span>

                <button
                  type="button"
                  className="delete-thread-btn"
                  aria-label="Delete thread"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-history">
            Your recent chats will appear here after you start a conversation.
          </div>
        )}
      </div>

      <div className="sign">
        <div className="profile-card">
          <div className="profile-avatar">S</div>
          <div className="profile-meta">
            <p className="profile-name">
              {localStorage.getItem("loggedInUser") || "Shruti Phad"}
            </p>
            <p className="profile-plan">Free plan</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sidebar;

// import "./Sidebar.css";
// import { useCallback, useContext, useEffect } from "react";
// import { MyContext } from "./MyContext.jsx";
// import { v1 as uuidv1 } from "uuid";
// import axios from "axios";


// function Sidebar() {
//   const {
//     allThreads,
//     setAllThreads,
//     currThreadId,
//     setNewChat,
//     setPrompt,
//     setReply,
//     setCurrThreadId,
//     setPrevChats,
//   } = useContext(MyContext);

  
//   const API_URL = import.meta.env.VITE_API_URL

//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");

//     return {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     };
//   };


//   const getAllThreads = useCallback(
//     async (signal) => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setAllThreads([]);
//         return;
//       }

//       try {
//         const response = await axios.get(`${API_URL}/api/thread`, {
//           signal,
//           headers: getAuthHeaders(),
//         });


//         const res = await response.data;
//         const threads = Array.isArray(res) ? res : [];

//         const filteredData = threads.map((thread) => ({
//           threadId: thread.threadId,
//           title: thread.title || "Untitled chat",
//         }));

//         setAllThreads(filteredData);
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("Failed to load threads:", err.message);
//         }
//       }
//     },
//     [setAllThreads]
//   );

//   useEffect(() => {
//     const controller = new AbortController();

//     getAllThreads(controller.signal);

//     return () => controller.abort();
//   }, [currThreadId, getAllThreads]);

//   const createNewChat = () => {
//     setNewChat(true);
//     setPrompt("");
//     setReply(null);
//     setCurrThreadId(uuidv1());
//     setPrevChats([]);
//   };

//   const changeThread = async (newThreadId) => {
//     if (!newThreadId || newThreadId === currThreadId) return;

//     const token = localStorage.getItem("token");

//     if (!token) {
//       setAllThreads([]);
//       return;
//     }
//     setCurrThreadId(newThreadId);

//     // try {
//     //   const response = await axios.get(`https://promptly-ezg2.onrender.com/api/thread/${newThreadId}`, {
//     //     method: "GET",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error(`Unable to load selected thread. Status: ${response.status}`);
//     //   }

//     try {
//       const response = await axios.get(`${API_URL}/api/thread/${newThreadId}`, {
//         headers: getAuthHeaders(),
//       });


//       const res = await response.json();
//       setPrevChats(Array.isArray(res) ? res : []);
//       setNewChat(false);
//       setReply(null);
//     } catch (err) {
//       console.error("Failed to open thread:", err.message);
//     }
//   };

//   const deleteThread = async (threadId) => {
//     if (!threadId) return;

//     const token = localStorage.getItem("token");

//     if (!token) {
//       setAllThreads([]);
//       return;
//     }

//     // try {
//     //   const response = await axios.get(`https://promptly-ezg2.onrender.com/api/thread/${threadId}`, {
//     //     method: "DELETE",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //   });

//     //   if (!response.ok) {
//     //     throw new Error(`Unable to delete thread. Status: ${response.status}`);
//     //   }

//     try {
//       await axios.delete(`${API_URL}/api/thread/${threadId}`, {
//         headers: getAuthHeaders(),
//       });


//       setAllThreads((prev) =>
//         prev.filter((thread) => thread.threadId !== threadId));

//       if (threadId === currThreadId) {
//         createNewChat();
//       }
//     } catch (err) {
//       console.error("Failed to delete thread:", err.message);
//     }
//   };

//   return (
//     <section className="sidebar">
//       <div className="sidebar-top">
//         <div className="sidebar-brand">
//           <div className="sidebar-logo">P</div>
//           <div className="sidebar-brand-text">
//             <span className="sidebar-title">Promptly</span>
//             <span className="sidebar-subtitle">AI workspace</span>
//           </div>
//         </div>

//         <button type="button" className="new-chat-btn" onClick={createNewChat}>
//           <span className="new-chat-btn-left">
//             <span>＋</span>
//             New chat
//           </span>
//           <span>✎</span>
//         </button>
//       </div>

//       <div className="history-wrapper">
//         <div className="history-label">Recent</div>

//         {allThreads?.length ? (
//           <ul className="history">
//             {allThreads.map((thread) => (
//               <li
//                 key={thread.threadId}
//                 onClick={() => changeThread(thread.threadId)}
//                 className={thread.threadId === currThreadId ? "highlighted" : ""}
//               >
//                 <span className="thread-icon">💬</span>
//                 <span className="thread-title">{thread.title}</span>

//                 <button
//                   type="button"
//                   className="delete-thread-btn"
//                   aria-label="Delete thread"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     deleteThread(thread.threadId);
//                   }}
//                 >
//                   ×
//                 </button>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="empty-history">
//             Your recent chats will appear here after you start a conversation.
//           </div>
//         )}
//       </div>

//       <div className="sign">
//         <div className="profile-card">
//           <div className="profile-avatar">S</div>
//           <div className="profile-meta">
//             <p className="profile-name">Shruti Phad</p>
//             <p className="profile-plan">Free plan</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Sidebar;
