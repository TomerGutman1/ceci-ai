# CECI-AI - Government Decisions Search Assistant

AI-powered search assistant for Israeli government decisions database with 24,716+ decisions.

## 🚀 Features

- **Smart Search**: AI-powered search using GPT-4 with Hebrew language support
- **35 Policy Tags**: Enhanced search accuracy with official government policy areas
- **Real-time Chat**: Streaming responses with markdown formatting
- **Full Database**: Access to 24,716 government decisions from Supabase
- **Bilingual Support**: Hebrew and English interface

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account with Israeli government decisions database
- OpenAI API key with GPT-4 access

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [your-private-repo-url]
cd ceci-ai-main
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env.local
cp server/.env.example server/.env.local

# Edit both .env.local files with your actual keys:
# - OPENAI_API_KEY
# - SUPABASE_URL  
# - SUPABASE_SERVICE_KEY
# - SUPABASE_ANON_KEY
```

## 🏃‍♂️ Running Locally

### Option 1: Run both frontend and backend (Recommended)
```bash
cd server
.\run-server.ps1
```
This will:
- Build the backend
- Start backend on port 5173
- Start frontend on port 5174
- Open browser automatically

### Option 2: Run separately
```bash
# Terminal 1 - Backend
cd server
npm run build
npm start

# Terminal 2 - Frontend
npm run dev
```

## 🏗️ Project Structure

```
ceci-ai-main/
├── src/                    # Frontend React app
│   ├── components/
│   │   └── chat/
│   │       └── ChatInterface.tsx
│   └── services/
│       └── chat.service.ts
├── server/                 # Backend Express server
│   ├── src/
│   │   ├── services/
│   │   │   └── decisionSearchService.ts
│   │   ├── llms/
│   │   │   ├── tools.ts
│   │   │   └── prompts/
│   │   ├── api/
│   │   │   └── openai.ts
│   │   └── controllers/
│   │       └── chat.ts
│   ├── dist/              # Compiled backend
│   └── package.json
├── .env.example           # Environment template
└── package.json           # Frontend dependencies
```

## 🔑 Environment Variables

### Frontend (.env.local)
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_API_URL` - Backend API URL (default: http://localhost:5173/api)

### Backend (server/.env.local)
- `OPENAI_API_KEY` - OpenAI API key with GPT-4 access
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `PORT` - Backend port (default: 5173)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5174)

## 🏷️ Supported Policy Tags

The system recognizes 35 official policy areas including:
- ביטחון לאומי וצה״ל
- חינוך
- בריאות ורפואה
- טכנולוגיה, חדשנות ודיגיטל
- And 31 more...

## 🚀 Deployment

### For Lovable.dev or similar platforms:

1. Set environment variables in platform dashboard
2. Build command: `npm run build`
3. Start command: `npm start`
4. Ensure both frontend (5174) and backend (5173) ports are configured

### Important Notes:
- The backend loads all 24K decisions into memory on startup
- First startup may take 10-20 seconds
- Requires ~200MB RAM for decision data

## 🔒 Security

- Never commit `.env` files
- Keep API keys secure
- This is a private repository - do not make public
- All keys belong to CECI

## 📞 Support

For issues or questions, contact the CECI development team.

---

**Note**: This project contains proprietary code and data belonging to CECI. Do not share or distribute without authorization.
