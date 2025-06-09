import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Interface matching the israeli_government_decisions table structure
interface Decision {
  id: number;
  decision_date?: string;
  decision_number: string;
  committee?: string;
  decision_title?: string;
  decision_content?: string;
  summary?: string;
  decision_url?: string;
  operativity?: boolean;
  tags_policy_area?: string;
  tags_government_body?: string;
  tags_location?: string;
  all_tags?: string;
  government_number?: number;
  prime_minister?: string;
  decision_key?: string;
  created_at?: string;
  updated_at?: string;
}

// Policy area tags mapping with synonyms and keywords
const POLICY_TAGS_MAPPING: Record<string, string[]> = {
  'ביטחון לאומי וצה״ל': ['ביטחון', 'צבא', 'צה"ל', 'צהל', 'הגנה', 'ביטחוני', 'צבאי', 'מודיעין', 'אמל"ח', 'נשק', 'לוחמה', 'מלחמה', 'ביטחון לאומי'],
  'ביטחון פנים וחירום אזרחי': ['ביטחון פנים', 'חירום', 'משטרה', 'כיבוי אש', 'הצלה', 'מד"א', 'פיקוד העורף', 'חירום אזרחי', 'ביטחון אזרחי', 'שב"ס', 'בתי סוהר'],
  'דיפלומטיה ויחסים בינ״ל': ['דיפלומטיה', 'יחסים בינלאומיים', 'חוץ', 'יחסי חוץ', 'שגרירות', 'קונסוליה', 'יחסים בין־לאומיים', 'מדיניות חוץ', 'הסכמים בינלאומיים'],
  'הגירה וקליטת עלייה': ['הגירה', 'עלייה', 'קליטה', 'עולים', 'מהגרים', 'קליטת עלייה', 'משרד העלייה', 'אזרחות', 'ויזה'],
  'תעסוקה ושוק העבודה': ['תעסוקה', 'עבודה', 'מועסקים', 'שוק העבודה', 'אבטלה', 'דורשי עבודה', 'שכר', 'תנאי עבודה', 'יחסי עבודה', 'זכויות עובדים'],
  'כלכלה מאקרו ותקציב': ['כלכלה', 'תקציב', 'מאקרו', 'תקציב המדינה', 'כלכלה לאומית', 'צמיחה', 'תוצר', 'אינפלציה', 'מדיניות כלכלית', 'משרד האוצר'],
  'פיננסים, ביטוח ומסים': ['פיננסים', 'ביטוח', 'מסים', 'מס', 'רשות המסים', 'בנקים', 'שוק ההון', 'ביטוח לאומי', 'מס הכנסה', 'מע"מ', 'מיסוי'],
  'פיתוח כלכלי ותחרות': ['פיתוח כלכלי', 'תחרות', 'הגבלים עסקיים', 'מונופולים', 'רשות התחרות', 'השקעות', 'עסקים', 'יזמות', 'סטארט-אפ'],
  'יוקר המחיה ושוק הצרכן': ['יוקר המחיה', 'צרכנות', 'מחירים', 'הגנת הצרכן', 'שוק הצרכן', 'עלות המחיה', 'סל הקניות', 'מוצרי יסוד'],
  'תחבורה ציבורית ותשתיות דרך': ['תחבורה', 'תחבורה ציבורית', 'אוטובוסים', 'רכבת', 'מטרו', 'רכבת קלה', 'כבישים', 'תשתיות', 'דרכים', 'נתיבי ישראל', 'משרד התחבורה'],
  'בטיחות בדרכים ורכב': ['בטיחות בדרכים', 'תאונות דרכים', 'רכב', 'רישוי', 'רישיון נהיגה', 'בטיחות', 'תאונות', 'אכיפה', 'קנסות תנועה'],
  'אנרגיה': ['אנרגיה', 'חשמל', 'גז', 'דלק', 'אנרגיה מתחדשת', 'סולארי', 'רוח', 'משרד האנרגיה', 'חברת החשמל', 'תחנות כוח'],
  'מים ותשתיות מים': ['מים', 'מקורות', 'ביוב', 'תשתיות מים', 'רשות המים', 'התפלה', 'מאגרי מים', 'צריכת מים', 'משק המים'],
  'סביבה, אקלים ומגוון ביולוגי': ['סביבה', 'אקלים', 'מגוון ביולוגי', 'איכות הסביבה', 'זיהום', 'פסולת', 'מיחזור', 'שינוי אקלים', 'הגנת הסביבה', 'קיימות'],
  'רשות הטבע והגנים ונוף': ['טבע', 'גנים לאומיים', 'שמורות טבע', 'רשות הטבע', 'נוף', 'שמירת טבע', 'חיות בר', 'צמחייה', 'אתרי טבע'],
  'חקלאות ופיתוח הכפר': ['חקלאות', 'כפר', 'חקלאים', 'משרד החקלאות', 'פיתוח הכפר', 'קיבוצים', 'מושבים', 'ישובים חקלאיים', 'גידולים חקלאיים'],
  'דיור, נדל״ן ותכנון': ['דיור', 'נדל"ן', 'תכנון', 'בנייה', 'דירות', 'משרד הבינוי', 'דיור ציבורי', 'מחירי דיור', 'תכנון ובנייה', 'ותמ"ל'],
  'שלטון מקומי ופיתוח פריפריה': ['שלטון מקומי', 'רשויות מקומיות', 'עיריות', 'מועצות', 'פריפריה', 'נגב', 'גליל', 'פיתוח אזורי', 'ערי פיתוח'],
  'בריאות ורפואה': ['בריאות', 'רפואה', 'בתי חולים', 'קופות חולים', 'רופאים', 'אחיות', 'משרד הבריאות', 'שירותי בריאות', 'תרופות', 'ביטוח בריאות'],
  'רווחה ושירותים חברתיים': ['רווחה', 'שירותים חברתיים', 'סעד', 'משרד הרווחה', 'עובדים סוציאליים', 'משפחות', 'ילדים בסיכון', 'אוכלוסיות מוחלשות'],
  'אזרחים ותיקים': ['אזרחים ותיקים', 'קשישים', 'פנסיה', 'גמלאים', 'זקנה', 'בתי אבות', 'סיעוד', 'גיל השלישי', 'פרישה'],
  'שוויון חברתי וזכויות אדם': ['שוויון', 'זכויות אדם', 'אפליה', 'נציבות שוויון', 'זכויות', 'צדק חברתי', 'נגישות', 'שוויון הזדמנויות'],
  'מיעוטים ואוכלוסיות ייחודיות': ['מיעוטים', 'ערבים', 'דרוזים', 'בדואים', 'צרקסים', 'נוצרים', 'חרדים', 'אוכלוסיות ייחודיות', 'מגזר ערבי', 'מגזר חרדי'],
  'מילואים ותמיכה בלוחמים': ['מילואים', 'לוחמים', 'חיילים', 'משוחררים', 'פצועי צה"ל', 'משפחות שכולות', 'ותיקי צה"ל', 'אנשי מילואים'],
  'חינוך': ['חינוך', 'בתי ספר', 'גני ילדים', 'תלמידים', 'מורים', 'משרד החינוך', 'מערכת החינוך', 'חינוך יסודי', 'חינוך על־יסודי', 'בגרות'],
  'השכלה גבוהה ומחקר': ['השכלה גבוהה', 'אוניברסיטאות', 'מכללות', 'מחקר', 'סטודנטים', 'אקדמיה', 'מלגות', 'דוקטורט', 'פרופסורים', 'מדע'],
  'תרבות ואמנות': ['תרבות', 'אמנות', 'תיאטרון', 'קולנוע', 'מוזיאונים', 'ספרות', 'מוסיקה', 'ריקוד', 'אמנים', 'יוצרים'],
  'ספורט ואורח חיים פעיל': ['ספורט', 'אורח חיים', 'פעילות גופנית', 'ספורטאים', 'אולימפיאדה', 'משחקים', 'כדורגל', 'כדורסל', 'אתלטיקה'],
  'מורשת ולאום': ['מורשת', 'לאום', 'זהות', 'מסורת', 'היסטוריה', 'ארכיאולוגיה', 'אתרי מורשת', 'מורשת ישראל', 'מורשת יהודית'],
  'תיירות ופנאי': ['תיירות', 'פנאי', 'תיירים', 'מלונות', 'אטרקציות', 'משרד התיירות', 'תיירות פנים', 'תיירות חוץ', 'אתרי תיירות'],
  'דת ומוסדות דת': ['דת', 'רבנות', 'בתי כנסת', 'מוסדות דת', 'כשרות', 'שבת', 'חגים', 'נישואין', 'גיור', 'משרד הדתות'],
  'טכנולוגיה, חדשנות ודיגיטל': ['טכנולוגיה', 'חדשנות', 'דיגיטל', 'היי-טק', 'תוכנה', 'אפליקציות', 'דיגיטציה', 'טרנספורמציה דיגיטלית', 'מו"פ'],
  'סייבר ואבטחת מידע': ['סייבר', 'אבטחת מידע', 'הגנת סייבר', 'האקרים', 'אבטחה', 'מידע', 'פרטיות', 'הגנת מידע', 'תקיפות סייבר'],
  'תקשורת ומדיה': ['תקשורת', 'מדיה', 'עיתונות', 'טלוויזיה', 'רדיו', 'אינטרנט', 'רשתות חברתיות', 'תקשורת המונים', 'שידור'],
  'משפט, חקיקה ורגולציה': ['משפט', 'חקיקה', 'רגולציה', 'חוקים', 'תקנות', 'בתי משפט', 'עורכי דין', 'שופטים', 'מערכת המשפט', 'חוק']
};

export class DecisionSearchService {
  private supabase;
  private openai;
  private decisions: Decision[] = [];
  private isLoaded = false;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    // Initialize Supabase client using environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials in environment');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    // Initialize OpenAI client
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      throw new Error('Missing OpenAI API key in environment');
    }
    
    this.openai = new OpenAI({ apiKey: openaiKey });
  }

  async loadDecisions(): Promise<void> {
    // Prevent multiple simultaneous loads
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    if (this.isLoaded) {
      return;
    }
    
    this.loadingPromise = this._loadDecisionsInternal();
    await this.loadingPromise;
    this.loadingPromise = null;
  }

  private async _loadDecisionsInternal(): Promise<void> {
    console.log('[DecisionSearchService] Starting to load Israeli government decisions...');
    const startTime = Date.now();
    const allData: Decision[] = [];
    const pageSize = 1000;
    let offset = 0;

    try {
      while (true) {
        const { data, error } = await this.supabase
          .from('israeli_government_decisions')
          .select('*')
          .range(offset, offset + pageSize - 1)
          .order('decision_date', { ascending: false, nullsFirst: false });

        if (error) {
          console.error('[DecisionSearchService] Supabase error:', error);
          throw new Error(`Failed to load decisions: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          break;
        }

        allData.push(...data);
        offset += pageSize;
        console.log(`[DecisionSearchService] Loaded ${allData.length} records so far...`);
        
        // Debug: Check first record structure
        if (allData.length === 1000) {
          console.log('[DecisionSearchService] Sample loaded record:', {
            decision_number: allData[0].decision_number,
            decision_title: allData[0].decision_title,
            decision_date: allData[0].decision_date,
            has_date: !!allData[0].decision_date,
            government_number: allData[0].government_number,
            fields: Object.keys(allData[0]).slice(0, 15)
          });
        }

        if (data.length < pageSize) {
          break;
        }
      }

      this.decisions = allData;
      this.isLoaded = true;
      const loadTime = (Date.now() - startTime) / 1000;
      console.log(`[DecisionSearchService] Successfully loaded ${this.decisions.length} decisions in ${loadTime}s`);
    } catch (error) {
      console.error('[DecisionSearchService] Failed to load decisions:', error);
      this.isLoaded = false;
      throw error;
    }
  }

  // Helper function to find matching policy tags
  private findMatchingPolicyTags(query: string): string[] {
    const queryLower = query.toLowerCase();
    const matchingTags: string[] = [];
    
    for (const [tagName, keywords] of Object.entries(POLICY_TAGS_MAPPING)) {
      // Check if query contains any of the keywords
      if (keywords.some(keyword => queryLower.includes(keyword.toLowerCase()))) {
        matchingTags.push(tagName);
        // Also add all keywords as potential matches
        matchingTags.push(...keywords);
      }
    }
    
    return [...new Set(matchingTags)]; // Remove duplicates
  }

  async searchDecisions(query: string, limit: number = 10): Promise<Decision[]> {
    // Ensure decisions are loaded
    await this.loadDecisions();

    console.log(`[DecisionSearchService] Searching for: "${query}"`);
    
    // Find matching policy tags based on query
    const matchingTags = this.findMatchingPolicyTags(query);
    console.log(`[DecisionSearchService] Matching tags found:`, matchingTags);

    // Create enhanced search prompt with tag information
    const searchPrompt = `You are analyzing a search query about Israeli government decisions.
Query: "${query}"

${matchingTags.length > 0 ? `
DETECTED POLICY AREAS: ${matchingTags.join(', ')}
These tags were found based on the query. Prioritize decisions with these exact tags in tags_policy_area field.
` : ''}

The decisions have these fields:
- decision_number: string (e.g., "1234", "2996-2025", "חמ/15/2024")
- decision_title: string (Hebrew title of the decision)
- decision_content: string (Full Hebrew text)
- summary: string (Hebrew summary)
- decision_date: string (ISO date format, e.g., "2025-01-15")
- committee: string (Committee name in Hebrew)
- tags_policy_area: string (Policy area tags in Hebrew - EXACT MATCHES from the official tags list)
- tags_government_body: string (Government bodies involved)
- tags_location: string (Relevant locations)
- all_tags: string (All tags combined)
- government_number: number (Government number, 1-37)
- prime_minister: string (Prime minister name)

Available policy tags in the system:
${Object.keys(POLICY_TAGS_MAPPING).join(', ')}

IMPORTANT RULES:
1. When user asks for "מהשנה האחרונה" or "recent", filter for decision_date >= '2024-01-01'
2. **PRIORITIZE TAG MATCHES**: If we detected policy areas, search for EXACT matches in tags_policy_area field
3. Tags are comma-separated, so use includes() to check if a tag exists
4. For multi-topic searches, use OR logic between topics
5. Search in this priority order:
   - Exact tag matches in tags_policy_area
   - Title matches
   - Content/summary matches
   - Related terms in any field

Generate a JavaScript filter function body that returns true for relevant decisions.

${matchingTags.length > 0 ? `
Example for detected tags:
${matchingTags.map(tag => `decision.tags_policy_area?.includes('${tag}')`).join(' || ')}
` : ''}

Return ONLY the function body (no function declaration, no return statement wrapper).
The function receives a 'decision' parameter.`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: searchPrompt }],
        temperature: 0.3,
        max_tokens: 500,
      });

      const filterLogic = response.choices[0].message.content || '';
      console.log(`[DecisionSearchService] Generated filter: ${filterLogic}`);
      
      // Create and execute filter function
      const filterFunc = new Function('decision', `return ${filterLogic}`) as (d: Decision) => boolean;
      const filtered = this.decisions.filter(decision => {
        try {
          return filterFunc(decision);
        } catch (error) {
          console.error('[DecisionSearchService] Error in filter function for decision:', decision.decision_number, error);
          return false;
        }
      });
      
      console.log(`[DecisionSearchService] Found ${filtered.length} matching decisions`);
      
      // Debug: Log first few decisions to check data structure
      if (filtered.length > 0) {
        console.log('[DecisionSearchService] Sample decision data:', {
          decision_number: filtered[0].decision_number,
          decision_title: filtered[0].decision_title,
          decision_date: filtered[0].decision_date,
          government_number: filtered[0].government_number,
          tags: {
            policy_area: filtered[0].tags_policy_area,
            government_body: filtered[0].tags_government_body,
            location: filtered[0].tags_location
          }
        });
      }
      
      // Return top results based on limit, sorted by relevance and date
      return filtered
        .sort((a, b) => {
          // First, prioritize decisions with exact matching policy tags
          const aHasExactTag = matchingTags.some(tag => 
            a.tags_policy_area?.includes(tag)
          );
          const bHasExactTag = matchingTags.some(tag => 
            b.tags_policy_area?.includes(tag)
          );
          
          if (aHasExactTag && !bHasExactTag) return -1;
          if (!aHasExactTag && bHasExactTag) return 1;
          
          // Then, prioritize decisions with matching tags (broader search)
          const queryTerms = query.toLowerCase().split(' ');
          const aHasRelevantTag = queryTerms.some(term => 
            (a.tags_policy_area?.toLowerCase().includes(term) || 
             a.tags_government_body?.toLowerCase().includes(term) ||
             a.all_tags?.toLowerCase().includes(term))
          );
          const bHasRelevantTag = queryTerms.some(term => 
            (b.tags_policy_area?.toLowerCase().includes(term) || 
             b.tags_government_body?.toLowerCase().includes(term) ||
             b.all_tags?.toLowerCase().includes(term))
          );
          
          // Decisions with relevant tags come first
          if (aHasRelevantTag && !bHasRelevantTag) return -1;
          if (!aHasRelevantTag && bHasRelevantTag) return 1;
          
          // Then sort by decision_date (newest first)
          if (a.decision_date && b.decision_date) {
            return b.decision_date.localeCompare(a.decision_date);
          }
          
          // If one has date and other doesn't, prioritize the one with date
          if (a.decision_date && !b.decision_date) return -1;
          if (!a.decision_date && b.decision_date) return 1;
          
          // Then by government number (newer governments first)
          if (a.government_number && b.government_number && a.government_number !== b.government_number) {
            return b.government_number - a.government_number;
          }
          
          // Finally by decision number
          const aNum = parseInt(a.decision_number.replace(/\D/g, '')) || 0;
          const bNum = parseInt(b.decision_number.replace(/\D/g, '')) || 0;
          return bNum - aNum;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('[DecisionSearchService] Error in GPT-4 search:', error);
      
      // Enhanced fallback with tag matching
      const searchTerms = query.toLowerCase().split(' ');
      const matchingTagsLower = matchingTags.map(t => t.toLowerCase());
      
      return this.decisions
        .filter(d => {
          // First check for exact tag matches
          if (matchingTagsLower.some(tag => d.tags_policy_area?.toLowerCase().includes(tag))) {
            return true;
          }
          
          // Then check all text fields
          const searchableText = `${d.decision_title || ''} ${d.summary || ''} ${d.decision_content || ''} ${d.tags_policy_area || ''} ${d.tags_government_body || ''} ${d.tags_location || ''} ${d.all_tags || ''}`.toLowerCase();
          return searchTerms.some(term => searchableText.includes(term));
        })
        .sort((a, b) => {
          // Prioritize exact tag matches
          const aHasExactTag = matchingTagsLower.some(tag => 
            a.tags_policy_area?.toLowerCase().includes(tag)
          );
          const bHasExactTag = matchingTagsLower.some(tag => 
            b.tags_policy_area?.toLowerCase().includes(tag)
          );
          
          if (aHasExactTag && !bHasExactTag) return -1;
          if (!aHasExactTag && bHasExactTag) return 1;
          
          // Sort by date
          if (a.decision_date && b.decision_date) {
            return b.decision_date.localeCompare(a.decision_date);
          }
          return 0;
        })
        .slice(0, limit);
    }
  }

  formatDecisionsResponse(decisions: Decision[]): string {
    if (decisions.length === 0) {
      return "לא נמצאו החלטות התואמות לחיפוש.";
    }

    const formatted = decisions.map((d, index) => {
      const url = d.decision_url || `https://www.gov.il/he/departments/policies/${d.decision_number}`;
      const summary = d.summary || d.decision_content || 'אין תקציר זמין';
      const truncatedSummary = summary.length > 150 ? summary.substring(0, 150) + '...' : summary;
      
      // Use decision_title (the correct field name)
      const displayTitle = d.decision_title || '';
      
      // Format the decision date
      let formattedDate = '';
      if (d.decision_date) {
        try {
          const date = new Date(d.decision_date);
          formattedDate = date.toLocaleDateString('he-IL', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } catch (e) {
          console.log('Failed to parse decision_date:', d.decision_date);
          formattedDate = d.decision_date; // Use as-is if parsing fails
        }
      }
      
      // Add relevant metadata
      const metadata = [];
      if (d.government_number) {
        // Convert to integer (remove decimal)
        const govNum = Math.floor(d.government_number);
        metadata.push(`ממשלה ${govNum}`);
      }
      if (d.prime_minister) metadata.push(`ראש ממשלה: ${d.prime_minister}`);
      if (d.committee) metadata.push(`ועדה: ${d.committee}`);
      
      const metadataStr = metadata.length > 0 ? `\n   📋 ${metadata.join(' | ')}` : '';
      
      // Add tags if available
      let tagsStr = '';
      if (d.tags_policy_area || d.tags_government_body || d.tags_location) {
        const tags = [];
        if (d.tags_policy_area) tags.push(`תחום: ${d.tags_policy_area}`);
        if (d.tags_government_body) tags.push(`גופים: ${d.tags_government_body}`);
        if (d.tags_location) tags.push(`מיקום: ${d.tags_location}`);
        tagsStr = `\n   🏷️ ${tags.join(' | ')}`;
      }
      
      return `${index + 1}. **החלטה ${d.decision_number}** ${displayTitle ? `- ${displayTitle}` : ''}
   ${formattedDate ? `📅 ${formattedDate}` : ''}${metadataStr}${tagsStr}
   📝 ${truncatedSummary}
   🔗 [קרא עוד](${url})`;
    }).join('\n\n');

    return formatted;
  }

  // Enhanced format for structured data (JSON-like)
  formatDecisionsAsStructured(decisions: Decision[]): object[] {
    return decisions.map(d => ({
      number: d.decision_number,
      title: d.decision_title || null,
      date: d.decision_date || null,
      content: d.decision_content?.substring(0, 200) || '',
      summary: d.summary || null,
      url: d.decision_url || `https://www.gov.il/he/departments/policies/${d.decision_number}`,
      committee: d.committee || null,
      government: d.government_number ? Math.floor(d.government_number) : null,
      primeMinister: d.prime_minister || null,
      tags: {
        policy_area: d.tags_policy_area || null,
        government_body: d.tags_government_body || null,
        location: d.tags_location || null,
        all: d.all_tags || null
      },
      operativity: d.operativity || null,
      key: d.decision_key || null
    }));
  }
  
  // Debug method to check if service is working
  getStatus(): { 
    service: string;
    isLoaded: boolean; 
    decisionCount: number;
    message: string;
    availablePolicyTags: string[];
  } {
    return {
      service: 'DecisionSearchService',
      isLoaded: this.isLoaded,
      decisionCount: this.decisions.length,
      message: this.isLoaded 
        ? `Service loaded with ${this.decisions.length} decisions` 
        : 'Service not yet loaded',
      availablePolicyTags: Object.keys(POLICY_TAGS_MAPPING)
    };
  }
}

// Singleton instance management
let instance: DecisionSearchService | null = null;

export function getDecisionSearchService(): DecisionSearchService {
  if (!instance) {
    instance = new DecisionSearchService();
  }
  return instance;
}
