# 🔧 Debug Guide for CECI-AI Server Logging Issues

## הבעיה
השרת רץ ומקבל בקשות, אבל הלוגים לא מופיעים בקונסול אחרי טעינת ההחלטות. זה מונע דיבאג של הבעיה העיקרית - למה הצ'אט לא משתמש בכלי החיפוש.

## כלי דיבאג שנוצרו

### 1. **debug-server.js** - מעקף nodemon/concurrently
```powershell
cd C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server
node debug-server.js
```
מריץ את השרת ישירות וכותב לוגים גם לקונסול וגם לקובץ בתיקיית `debug-logs`.

### 2. **run-debug.ps1** - PowerShell runner נקי
```powershell
cd C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server
.\run-debug.ps1 -Build -Clean
```
פרמטרים:
- `-Build` - מבצע build מחדש
- `-Clean` - מנקה לוגים ישנים

### 3. **test-decisions.ts** - בדיקה ישירה של השירות
```powershell
cd C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server
npx tsx test-decisions.ts
```
בודק ישירות את שירות החיפוש בלי להריץ את כל השרת.

### 4. **test-api.ps1** - בודק את כל ה-endpoints
```powershell
cd C:\Users\tomer\OneDrive\Desktop\integration\ceci-ai-main\server
.\test-api.ps1
```
בודק:
- `/health`
- `/api/decisions/status`
- `/test-decisions`
- `/api/chat` עם שאלה על החלטות

### 5. **main-debug.ts** - גרסת main עם לוגים משופרים
להחלפה זמנית:
```powershell
.\swap-main.ps1          # מחליף ל-debug version
npm run build
npm start

# לחזור למקור:
.\swap-main.ps1 -Restore
npm run build
```

## מיקומי לוגים

1. **קונסול** - אמור להציג את כל הלוגים
2. **server.log** - בתיקיית השרת
3. **logs/*.log** - לוגים מפורטים לפי תאריך
4. **debug-logs/*.log** - לוגים מ-debug-server.js

## בדיקות מומלצות

### בדיקה 1: הרצה נקייה
```powershell
# הרג תהליכים קיימים
Get-Process node | Stop-Process -Force

# הרצה נקייה
.\run-debug.ps1 -Build -Clean
```

### בדיקה 2: בדיקת שירות בלבד
```powershell
npx tsx test-decisions.ts
```

### בדיקה 3: בדיקת API
```powershell
# בחלון אחד - הרץ את השרת
.\run-debug.ps1

# בחלון שני - בדוק את ה-API
.\test-api.ps1
```

### בדיקה 4: הרצה עם npm scripts חדשים
```powershell
npm run dev:debug    # משתמש ב-debug-server.js
# או
npm run dev:clean    # רק node dist/main.js
```

## מה לחפש בלוגים

1. **"Decision search service initialized"** - השירות נטען בהצלחה
2. **"REQUEST POST /api/chat"** - בקשת צ'אט התקבלה
3. **"TOOL CALL: search_decisions"** - הכלי נקרא (זה מה שחסר!)
4. **"Searching decisions"** - החיפוש מתבצע

## אם עדיין אין לוגים

1. **בדוק את תיקיית logs** - אולי הלוגים נכתבים רק לקובץ
2. **נסה PowerShell אחר** - לפעמים יש בעיות עם terminal ספציפי
3. **הרץ בלי build tools**:
   ```powershell
   cd server
   npm run build
   node dist/main.js > output.log 2>&1
   ```
4. **בדוק Windows Event Viewer** - אולי יש שגיאות מערכת

## הבעיה הספציפית - הצ'אט לא משתמש בכלי

גם אם הלוגים יעבדו, צריך לבדוק:
1. האם הכלי מוגדר נכון ב-`tools.ts`
2. האם ה-prompt ב-`ASSISTANT_PROMPT.ts` ברור מספיק
3. האם OpenAI מקבל את הגדרת הכלי
4. האם יש שגיאה בפונקציה שמטפלת ב-tool calls

## המלצה
התחל עם `.\run-debug.ps1 -Build -Clean` - זה הכי נקי ופשוט.
