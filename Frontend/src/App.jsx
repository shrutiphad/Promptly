import "./App.css";
import Signup from "./Signup";
import Login from "./Login";
import { MyContext } from "./MyContext.jsx";
import { useMemo, useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Home.jsx";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(() => uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = useMemo(
    () => ({
      prompt,
      setPrompt,
      reply,
      setReply,
      currThreadId,
      setCurrThreadId,
      newChat,
      setNewChat,
      prevChats,
      setPrevChats,
      allThreads,
      setAllThreads,
    }),
    [prompt, reply, currThreadId, newChat, prevChats, allThreads]
  );

  return (
    <BrowserRouter>
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
