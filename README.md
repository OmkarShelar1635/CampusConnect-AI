# CampusConnect-AI 🤖🏫

**CampusConnect-AI** is an AI-powered Smart Campus Assistant that helps students and visitors quickly access information about departments, faculty, events, facilities, and notices.

The system uses **Machine Learning for intent classification**, **MongoDB as the knowledge base**, and **Google Gemini LLM for natural language responses**, built on the **MERN stack**.

---

## 🚀 Features

- 🤖 AI-powered campus chatbot  
- 🧠 Machine Learning intent classification (Naive Bayes)  
- 📚 Retrieval-Augmented Generation (RAG) using MongoDB  
- ✨ Natural language responses using Gemini API  
- 📊 Admin dashboard to manage campus information  
- 🔐 JWT authentication for users and admins  
- ⚡ Response caching to reduce API usage  
- 📱 Fully responsive UI with Tailwind CSS  

---

## 🏗️ Architecture
User Query → Normalize Question → Cache Check → ML Intent Classifier → MongoDB Retrieval → Gemini API → Save to Cache → Response 

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB (MongoDB Atlas)

### Machine Learning
- Naive Bayes Classifier (`natural` NLP library)

### Generative AI
- Google Gemini API

### Authentication
- JSON Web Token (JWT)

### Other Tools
- REST APIs
- Git & GitHub
- Postman

---

## 🧠 Machine Learning Component

The chatbot uses a **Naive Bayes text classifier** to detect user intent.

Example intents:

| User Question | Predicted Intent |
|---------------|------------------|
| Who is HOD of CS? | department_hod |
| Show faculty members | faculty_query |
| List upcoming events | event_query |
| Library timing | facility_query |
| Latest notice | notice_query |

The intent classifier routes queries to the correct MongoDB collection before generating the response.

---
## 👨‍💻 Author

Omkar Shelar
