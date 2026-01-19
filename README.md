# Promptly – Intelligent Conversational Platform

Promptly is a modern AI-powered web application that enables users to interact with large language models through a secure, scalable, and personalized chat experience. It is designed with authentication, isolated conversation threads, and API-based LLM integration to deliver reliable, real-time AI interactions.

## Features

- **Secure Authentication**

  - User registration and login system
  - Session handling / token-based auth
  - Protected routes for private access

- **Isolated User Threads**

  - Each user has independent chat sessions
  - Conversations are stored and retrieved per user
  - No data leakage between accounts

- **LLM API Integration**

  - Connects with external AI APIs for response generation
  - Supports dynamic prompt handling
  - Scalable architecture for model upgrades

- **Real-Time Messaging**

  - Fast request/response flow
  - Optimized backend for low latency interactions

- **Conversation Management**

  - Create, view, and continue multiple chat threads
  - Persist chat history in database

- **Backend Security**
  - Input validation
  - API protection
  - Environment-based config handling

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript / React
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** JWT / Sessions
- **AI Layer:** External LLM APIs
- **Deployment Ready:** Environment-based configuration
