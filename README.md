# CodeSync - Video Calling Interview Platform

CodeSync is a modern, feature-rich platform designed for conducting technical interviews with integrated video calling and real-time coding capabilities. It provides a seamless experience for both interviewers and candidates.

![Demo App](/public/screenshot-for-readme.png)

## 🌟 Features

### Video Interview Features

- 🎥 High-quality video calls
- 🖥️ Screen sharing capabilities
- 🎬 Screen recording functionality
- 👥 Multiple participant support
- 📊 Grid and Speaker view layouts
- 🔒 Secure and encrypted communication

### Coding Environment

- 💻 Integrated Monaco Editor (VS Code-like experience)
- 🔤 Multiple language support (JavaScript, Python, Java)
- 📝 Pre-built coding questions
- 📋 Problem description with examples
- ⚡ Real-time code execution
- 🎨 Syntax highlighting
- 📱 Responsive design

### Interview Management

- 📅 Interview scheduling system
- 👤 User role management (Interviewer/Candidate)
- 📊 Interview feedback and ratings
- 📝 Detailed comments and evaluation
- 📈 Interview history tracking

### Authentication & Security

- 🔐 Secure authentication with Clerk
- 👤 User profile management
- 🔒 Role-based access control
- 🛡️ Protected routes

## 🛠️ Tech Stack

### Frontend

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:**
  - Tailwind CSS
  - Shadcn UI
  - Radix UI
- **State Management:** React Hooks
- **Video SDK:** Stream Video SDK
- **Code Editor:** Monaco Editor

### Backend

- **Database:** Convex
- **Authentication:** Clerk
- **Real-time Communication:** Stream
- **API:** Next.js API Routes

### Development Tools

- **Package Manager:** npm
- **Version Control:** Git
- **Code Quality:** TypeScript
- **Build Tool:** Next.js

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/codesync.git
   cd codesync
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CONVEX_DEPLOYMENT=your_convex_deployment
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
   STREAM_SECRET_KEY=your_stream_secret_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open the application**
   Visit `http://localhost:3000` in your browser

## 📝 Prerequisites

Before running the application, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- Accounts on:
  - [Clerk](https://clerk.dev/) for authentication
  - [Convex](https://www.convex.dev/) for database
  - [Stream](https://getstream.io/) for video calls

## 🔧 Configuration

### Clerk Setup

1. Create a Clerk account
2. Create a new application
3. Get your API keys
4. Configure authentication settings

### Convex Setup

1. Create a Convex account
2. Create a new project
3. Get your deployment URL
4. Set up your database schema

### Stream Setup

1. Create a Stream account
2. Create a new application
3. Get your API keys
4. Configure video settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Clerk](https://clerk.dev/)
- [Convex](https://www.convex.dev/)
- [Stream](https://getstream.io/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
