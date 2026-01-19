import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./MyContext.jsx";
import { useState } from 'react';
import {v1 as uuidv1} from "uuid";


function Home() {
  return (
    <div className="app">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default Home;
