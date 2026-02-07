
# ResumeCraft

ResumeCraft is a professional resume builder application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Secure signup and login.
- **Dashboard**: Manage multiple resumes.
- **Resume Builder**: Step-by-step editor with live preview.
- **PDF Export**: Download high-quality PDFs of your resume.
- **Public Portfolio**: Share your resume via a unique public link.
- **Modern Design**: Built with Tailwind CSS for a sleek look.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Running locally or a cloud URI)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ResumeCraft
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resumecraft
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
node index.js
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to use the application.

## Project Structure

- `client/`: React frontend
  - `src/pages`: Application pages (Dashboard, Editor, etc.)
  - `src/components`: Reusable components
  - `src/context`: State management context
- `server/`: Node.js backend
  - `models/`: Mongoose schemas
  - `routes/`: API routes
  - `controllers/`: Request handlers

## License

MIT
