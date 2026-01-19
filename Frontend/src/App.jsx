import './App.css';
import Signup from "./Signup";
import Login from "./Login";
import { MyContext } from "./MyContext.jsx";
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify"
import Home from './Home.jsx';
//import RefreshHandler from './RefreshHandler.jsx';//<RefreshHandler setIsAuthenticated={setIsAuthenticated} />

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };


  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  
  return (
    <BrowserRouter>
      <MyContext.Provider value={providerValues}>
      
        <Routes>

          <Route path="/" element={ <Navigate to="/login" /> } />

          <Route path="/signup" element={<Signup />} />

          <Route path="/login" element={<Login />} />
            
            <Route path="/chat" element={  <Home /> }/>

          {/* <Route path="/chat" element={<PrivateRoute> <ChatWindow /> </PrivateRoute>}/>
            
           <Route path="/chat" element={ <PrivateRoute> <Sidebar /> </PrivateRoute>}/> */}
      
        </Routes>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
