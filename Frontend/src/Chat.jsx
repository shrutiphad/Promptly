

import "./Chat.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { handleError, handleSuccess } from "./utils.js";

function Chat() {
  const { newChat, prevChats, reply, setPrompt } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const bottomRef = useRef(null);

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (text,index) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedIndex(index);
      handleSuccess("Copied to clipboard!");

      setTimeout(() => {
        setCopiedIndex(null);
      }, 1500);
    } catch (err) {
      console.error("Copy failed:", err);
      handleError("Failed to copy message");
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }

    if (!prevChats?.length) return;

    const content = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 35);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  const starterPrompts = [
    "Explain this code simply",
    "Debug my React error",
    "Write a clean resume bullet",
    "Summarize this topic fast",
  ];

  const renderAssistantMessage = (content,index, showActions = true) => (
    <div className="message-bubble aiMessage">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>

      {showActions && (
        <div className="message-actions">
           <button
            type="button"
            className="message-action-btn"
            onClick={() => handleCopy(content, index)}
          >
            {copiedIndex === index ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );

  if (newChat && !prevChats?.length) {
    return (
      <div className="chats chats--empty">
        <div className="chat-empty-state">
          <div className="empty-mark">✦</div>
          <h1>You are just one PROMPT away!</h1>
          <p>Start a focused conversation, ask for code help, debug errors, or turn rough ideas into polished work.</p>
          <div className="prompt-grid">
            {starterPrompts.map((prompt) => (
              <button
                type="button"
                className="prompt-chip"
                key={prompt}
                onClick={() => setPrompt(prompt)}
              >
                {prompt} →
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const olderChats = prevChats?.slice(0, -1) || [];
  const lastChat = prevChats?.length ? prevChats[prevChats.length - 1] : null;

  return (
    <div className="chats">
      {olderChats.map((chat, idx) => (
        <div className={`chat-row ${chat.role === "user" ? "userDiv" : "gptDiv"}`} key={idx}>
          <div className="chat-avatar">{chat.role === "user" ? "S" : "P"}</div>
          {chat.role === "user" ? (
            <p className="message-bubble userMessage">{chat.content}</p>
          ) : (
            renderAssistantMessage(chat.content)
          )}
        </div>
      ))}

      {lastChat && (
        <div className={`chat-row ${lastChat.role === "user" ? "userDiv" : "gptDiv"}`}>
          <div className="chat-avatar">{lastChat.role === "user" ? "S" : "P"}</div>
          {lastChat.role === "user" ? (
            <p className="message-bubble userMessage">{lastChat.content}</p>
          ) : latestReply === null ? (
          //   renderAssistantMessage(lastChat.content)
          // ) : (
              //   renderAssistantMessage(latestReply, false)
              renderAssistantMessage(lastChat.content, prevChats.length - 1)
            ) : (
              renderAssistantMessage(latestReply, prevChats.length - 1, false)
          )}
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default Chat;
