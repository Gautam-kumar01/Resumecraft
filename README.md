
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

### Quick Start (Development)
You can run both the client and server concurrently from the root directory:

1. Install root dependencies:
```bash
npm install
```

2. Start both servers:
```bash
npm start
```
This will run the server on port 5000 and the client on port 5173 (or 5174 if 5173 is busy).

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
- `server/`: Node.js backend

## Deployment (Vercel)

To deploy ResumeCraft to Vercel, follow these steps:

1. **Environment Variables**: You MUST set the following Environment Variables in the Vercel Dashboard for your project:
   - `MONGO_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://...`)
   - `JWT_SECRET`: A strong secret key for token signing.
   - `EMAIL_USER`: Your Gmail address (for OTP verification).
   - `EMAIL_PASS`: Your Gmail App Password.
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.

2. **Backend Entry**: The project uses a `vercel.json` file in the root to route `/api` requests to the `server/index.js` function.

3. **Database**: Since Vercel is serverless, ensure your MongoDB Atlas IP Access List allows connections from anywhere (`0.0.0.0/0`) or use a managed database service.

4. **Debugging**: If registration fails, check the **Function Logs** in the Vercel dashboard to see the exact error message (e.g., MongoDB timeout or invalid JWT secret).

## License

MIT
