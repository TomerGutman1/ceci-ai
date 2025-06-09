# 📋 מדריך שיפור כלי החיפוש - CECI-AI

## 🎯 מיקומי הקבצים לשיפור

### 1️⃣ **הגדרת הכלי עצמו**
**קובץ:** `server\src\llms\tools.ts`
```typescript
search_decisions: {
    type: 'function',
    name: 'search_decisions',
    description: 'ALWAYS use this tool...', // כאן אפשר לשפר את ההוראות
    parameters: {
        // כאן אפשר להוסיף פרמטרים כמו:
        // - date_range
        // - ministry
        // - decision_type
        // - limit
    }
}
```

### 2️⃣ **ה-Prompt הראשי של האסיסטנט**
**קובץ:** `server\src\llms\prompts\ASSISTANT_PROMPT.ts`
```typescript
// כאן מוגדר מתי להשתמש בכלי
// אפשר להוסיף:
// - הוראות יותר ברורות
// - דוגמאות נוספות
// - פורמט תצוגה משופר
```

### 3️⃣ **לוגיקת החיפוש**
**קובץ:** `server\src\services\decisionSearchService.ts`
```typescript
// כאן קורה החיפוש בפועל
searchDecisions(query: string, limit: number = 10)
// אפשר לשפר:
// - אלגוריתם החיפוש
// - סינון תוצאות
// - דירוג רלוונטיות
// - חיפוש לפי תאריכים
```

### 4️⃣ **טיפול בתוצאות**
**קובץ:** `server\src\api\openai.ts`
```typescript
// בפונקציה callFunction
if (toolName === 'search_decisions') {
    // כאן אפשר לשפר את:
    // - פורמט התגובה
    // - כמות המידע המוחזר
    // - הוספת סיכומים
}
```

## 🔧 שיפורים מומלצים

### א. הוספת פרמטרים לכלי:
```typescript
parameters: {
    properties: {
        search_query: { type: 'string' },
        date_from: { type: 'string', description: 'YYYY-MM-DD' },
        date_to: { type: 'string', description: 'YYYY-MM-DD' },
        ministry: { type: 'string', enum: ['חינוך', 'בריאות', 'ביטחון', ...] },
        limit: { type: 'number', default: 10, maximum: 50 },
        sort_by: { type: 'string', enum: ['date', 'relevance'] }
    }
}
```

### ב. שיפור החיפוש:
- חיפוש בכל השדות (title, summary, content)
- ניקוד רלוונטיות
- חיפוש מורפולוגי בעברית
- תמיכה בביטויים מדויקים

### ג. שיפור התצוגה:
- הוספת תאריך להחלטה
- הצגת המשרד הרלוונטי
- סיכום קצר יותר ברור
- קיבוץ לפי נושאים

### ד. הוספת יכולות:
- חיפוש מתקדם (AND/OR/NOT)
- סינון לפי סטטוס החלטה
- חיפוש החלטות קשורות
- ייצוא תוצאות

## 📝 דוגמה לשיפור מיידי

**בקובץ `tools.ts`:**
```typescript
search_decisions: {
    description: `חפש החלטות ממשלה במאגר של 24,716 החלטות.
    השתמש בכלי זה תמיד כש:
    - מבקשים מידע על החלטות ממשלה
    - שואלים מה הממשלה החליטה
    - מחפשים החלטות לפי נושא/תאריך/משרד
    
    טיפים לחיפוש:
    - חפש בעברית או אנגלית
    - ציין תאריכים אם רלוונטי
    - ציין משרד ממשלתי אם ידוע`,
    // ...
}
```

## 🚀 איך להתחיל

1. **בחר מה לשפר** - התחל בדבר אחד קטן
2. **ערוך את הקובץ הרלוונטי**
3. **בנה מחדש**: `npm run build`
4. **הפעל מחדש את השרת**
5. **בדוק ב-UI**

## 💡 רעיונות נוספים
- הוספת חיפוש לפי מספר החלטה
- תמיכה בחיפוש טקסט חופשי
- הצגת החלטות דומות
- סטטיסטיקות על התוצאות
- שמירת חיפושים אחרונים
