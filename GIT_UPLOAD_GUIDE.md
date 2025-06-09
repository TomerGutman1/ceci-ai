# Git Upload Instructions for CECI-AI

## ⚠️ IMPORTANT: Security First!

Before uploading, ensure ALL sensitive data is removed:
1. API keys
2. Database credentials  
3. Any CECI internal information

## 📝 Step-by-Step Guide

### 1. Initialize Git (if not already done)
```bash
cd C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main
git init
```

### 2. Add files to Git
```bash
# Add all files except those in .gitignore
git add .

# Check what will be committed
git status

# IMPORTANT: Verify no .env files are listed!
```

### 3. Create initial commit
```bash
git commit -m "Initial commit: CECI-AI Government Decisions Search Assistant"
```

### 4. Create private repository on GitHub
1. Go to https://github.com/new
2. Repository name: `ceci-ai`
3. Set to **PRIVATE** (Very important!)
4. Don't initialize with README (we already have one)

### 5. Connect to GitHub
```bash
# Replace [username] with actual GitHub username
git remote add origin https://github.com/[username]/ceci-ai.git
git branch -M main
git push -u origin main
```

## 🔐 Setting up Environment Variables in Lovable/Production

### For Lovable.dev:
1. Go to project settings
2. Add environment variables:
   - `OPENAI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `SUPABASE_ANON_KEY`

### For Vercel:
1. Import GitHub repository
2. Add environment variables in project settings
3. Deploy

## 🚀 Deployment Configuration

The project is configured to run both frontend and backend. 
Make sure the platform supports Node.js backend services.

### Build Commands:
- Build: `npm run build`
- Start: `npm start`
- Install: `npm run install:all`

## ⚠️ Final Checklist

- [ ] All .env files are in .gitignore
- [ ] No API keys in code
- [ ] Repository is PRIVATE
- [ ] README doesn't contain sensitive info
- [ ] Environment variables are documented but not exposed

## 📞 Support

If you encounter issues:
1. Check server logs
2. Verify environment variables
3. Ensure ports 5173 (backend) and 5174 (frontend) are available

---

**Remember**: This code belongs to CECI. Keep it private and secure!
