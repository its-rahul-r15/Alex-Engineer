<div align="center">

# 🚀 Alex Engineer

### AI-Powered Collaborative Code Editor & Development Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen.svg)](https://www.mongodb.com/)
[![WebContainer](https://img.shields.io/badge/WebContainer-API-orange.svg)](https://webcontainers.io/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Screenshots](#-screenshots) • [Contributing](#-contributing)

</div>

---

## 📖 About

**Alex Engineer** is a revolutionary web-based collaborative development platform that brings the power of a full-fledged IDE to your browser. Built with cutting-edge technologies, it enables real-time collaboration, AI-assisted coding, and instant project deployment—all without leaving your browser.

### ✨ Why Alex Engineer?

- 🤖 **AI-Powered Development** - Integrate Google Gemini AI to generate code, fix bugs, and build complete project structures with simple prompts
- 👥 **Real-time Collaboration** - Work together with your team in real-time using WebSocket technology
- 🌐 **In-Browser Execution** - Run Node.js applications directly in the browser using WebContainer technology
- 🚀 **One-Click Deployment** - Deploy your projects to Vercel instantly with built-in deployment integration
- 💾 **Persistent Storage** - All your projects and code are safely stored in MongoDB
- 🎨 **Modern UI/UX** - Beautiful, responsive interface built with React and Tailwind CSS

---

## 🎯 Features

### Core Features

<table>
<tr>
<td width="50%">

#### 🤝 Real-time Collaboration
- Multi-user project access
- Synchronized code editing
- Live chat with team members
- Collaborator management system

</td>
<td width="50%">

#### 🤖 AI Assistant Integration
- Google Gemini AI integration
- Natural language code generation
- Automatic project structure creation
- Intelligent code suggestions

</td>
</tr>
<tr>
<td width="50%">

#### 💻 In-Browser Development
- WebContainer-powered execution
- Run Node.js projects in browser
- Real-time preview window
- Terminal output monitoring

</td>
<td width="50%">

#### 🚀 Deployment Integration
- One-click Vercel deployment
- Real-time deployment status
- Automatic build process
- Deployment URL generation

</td>
</tr>
</table>

### Additional Features

- 📝 **Syntax Highlighting** - Support for multiple programming languages
- 📂 **File Management** - Intuitive file tree navigation
- 🔐 **Authentication** - Secure JWT-based user authentication
- 💬 **Project Chat** - Built-in messaging for each project
- 🎨 **Code Editor** - Full-featured editor with syntax highlighting
- 📱 **Responsive Design** - Works seamlessly on all devices

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| ⚛️ **React 19.2** | UI Framework |
| 🎨 **Tailwind CSS 4.1** | Styling & Design |
| 🚀 **Vite 7.2** | Build Tool & Dev Server |
| 🔌 **Socket.io Client** | Real-time Communication |
| 📦 **WebContainer API** | In-browser Node.js Runtime |
| 🎨 **Highlight.js** | Syntax Highlighting |
| 📝 **Markdown-to-JSX** | Markdown Rendering |
| 🧭 **React Router** | Client-side Routing |

### Backend

| Technology | Purpose |
|------------|---------|
| 🟢 **Node.js & Express** | Server Framework |
| 🗄️ **MongoDB & Mongoose** | Database & ODM |
| 🔌 **Socket.io** | WebSocket Server |
| 🤖 **Google Gemini AI** | AI Code Generation |
| 🔐 **JWT** | Authentication |
| 🔒 **Bcrypt** | Password Hashing |
| ⚡ **Redis (ioredis)** | Caching & Session Management |
| 🚀 **Axios** | HTTP Client |

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Redis (optional, for caching)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/its-rahul-r15/Alex-Engineer.git
cd Alex-Engineer
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to `backend/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_AI_KEY=your_google_gemini_api_key
REDIS_HOST=localhost
REDIS_PORT=6379
```

```bash
# Start the backend server
npm run dev
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
touch .env
```

Add the following environment variables to `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
# Start the frontend development server
npm run dev
```

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🎮 Usage

### Getting Started

1. **Register/Login**
   - Create a new account or login with existing credentials
   - JWT tokens are used for secure authentication

2. **Create a Project**
   - Click "New Project" from the dashboard
   - Give your project a name
   - Start coding!

3. **Collaborate with Team**
   - Add collaborators using the "Add Collaborator" button
   - Share the project with team members
   - Work together in real-time

4. **Use AI Assistant**
   - Type `@ai` in the chat followed by your request
   - Example: `@ai create a react todo app with tailwind`
   - The AI will generate the complete project structure

5. **Run Your Project**
   - Click the "Run" button to execute your code
   - View output in the integrated preview window
   - Check terminal logs for debugging

6. **Deploy to Vercel**
   - Click the "Deploy" button
   - Monitor deployment status in real-time
   - Get your live deployment URL

---

## 🎨 Screenshots

### Dashboard
> Main project dashboard with project listing and creation interface

### Code Editor
> Full-featured code editor with syntax highlighting and file management

### AI Integration
> AI assistant generating code from natural language prompts

### Live Preview
> In-browser preview of running applications

---

## 🗂 Project Structure

```
Alex-Engineer/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   │   ├── ai.service.js    # Google Gemini integration
│   │   ├── deploy.service.js # Vercel deployment
│   │   ├── project.service.js
│   │   ├── user.service.js
│   │   └── redis.service.js
│   ├── middleware/          # Custom middleware
│   ├── db/                  # Database configuration
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── screens/        # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Project.jsx # Main editor interface
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/        # React context
│   │   ├── config/         # Configuration files
│   │   ├── routes/         # Route definitions
│   │   ├── auth/           # Authentication components
│   │   └── App.jsx
│   ├── public/
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## 🔑 Key Features Explained

### WebContainer Integration

WebContainer allows running Node.js directly in the browser:

```javascript
// Initialize WebContainer
const container = await getWebContainer()
await webContainer.mount(fileTree)

// Run npm commands
await webContainer.spawn("npm", ["install"])
await webContainer.spawn("npm", ["run", "dev"])
```

### Real-time Collaboration

Socket.io enables multi-user real-time editing:

```javascript
// Send message to project room
socket.emit('project-message', {
  message: 'Hello team!',
  sender: user
})

// Receive updates from other users
socket.on('project-message', (data) => {
  // Update UI with new message
})
```

### AI Code Generation

Integrate Google Gemini for intelligent code generation:

```javascript
// Request AI assistance
const prompt = "@ai create a REST API with Express"
const aiResponse = await generateResult(prompt)

// AI returns complete file structure
const { fileTree } = JSON.parse(aiResponse)
```

---

## 🚀 Deployment

### Deploy Backend

```bash
# Build for production
cd backend
npm start

# Or use PM2 for process management
pm2 start server.js --name "alex-engineer-api"
```

### Deploy Frontend

```bash
# Build for production
cd frontend
npm run build

# Preview production build
npm run preview
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment:

**Backend:**
- `MONGO_URI` - Production MongoDB connection
- `JWT_SECRET` - Strong secret key
- `GOOGLE_AI_KEY` - Google Gemini API key
- `REDIS_HOST` & `REDIS_PORT` - Redis configuration

**Frontend:**
- `VITE_API_URL` - Production API endpoint

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 API Documentation

### Authentication Endpoints

```http
POST /users/register    # Register new user
POST /users/login       # Login user
GET  /users/profile     # Get user profile
GET  /users/all         # Get all users
```

### Project Endpoints

```http
POST   /projects/create           # Create new project
GET    /projects/all              # Get all projects
GET    /projects/get-project/:id  # Get specific project
PUT    /projects/add-user         # Add collaborator
PUT    /projects/update-file-tree # Save project files
```

### Deployment Endpoints

```http
POST   /deploy/start              # Start deployment
GET    /deploy/status/:id         # Check deployment status
```

### AI Endpoints

```http
POST   /ai/generate               # Generate code with AI
```

---

## 🐛 Known Issues & Limitations

- WebContainer API works only in modern browsers with SharedArrayBuffer support
- Browser must be served over HTTPS in production for WebContainer to work
- Multiple WebContainer instances cannot run simultaneously in different tabs
- Large file operations may impact browser performance

---

## 🔮 Future Enhancements

- [ ] Git integration for version control
- [ ] Support for more programming languages
- [ ] Plugin system for extensibility
- [ ] Dark/Light theme toggle
- [ ] Code formatting and linting
- [ ] Multiple AI model support
- [ ] Video call integration for collaboration
- [ ] Mobile app development
- [ ] Docker container support
- [ ] Advanced deployment options (AWS, Netlify, etc.)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Rahul Sharma**

- GitHub: [@its-rahul-r15](https://github.com/its-rahul-r15)
- Project Link: [https://github.com/its-rahul-r15/Alex-Engineer](https://github.com/its-rahul-r15/Alex-Engineer)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [WebContainer](https://webcontainers.io/) - In-browser Node.js runtime
- [Google Gemini](https://ai.google.dev/) - AI integration
- [Socket.io](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with ❤️ by [Rahul Sharma](https://github.com/its-rahul-r15)

</div>
