import OpenAI from 'openai'
import { Stream } from 'openai/streaming'
import { getAssistantConfig, getEvaluatorConfig } from '../llms/configs'
import { LLMReqParams } from '../types/prompts'
import { ResponseFunctionToolCall } from 'openai/resources/responses/responses'
import { ToolName } from '../llms/tools'
import { getDecisionSearchService } from '../services/decisionSearchService';

const openai = new OpenAI()

export async function getAssistantResponse(
  llmReqParams: LLMReqParams,
): Promise<Stream<OpenAI.Responses.ResponseStreamEvent>> {
  const promptConfig = getAssistantConfig(llmReqParams)
  console.log('[OpenAI] Assistant request with tools:', promptConfig.tools?.map(t => (t as any).function?.name || 'unknown'));
  console.log('[OpenAI] User message:', llmReqParams.newInput);
  const result = await openai.responses.create(promptConfig)

  return result
}

export async function getEvaluatorResponse(
  llmReqParams: LLMReqParams,
): Promise<OpenAI.Responses.Response> {
  const promptConfig = getEvaluatorConfig(llmReqParams)
  const result = await openai.responses.create(promptConfig)

  return result
}

export async function callFunction(
  toolCall: ResponseFunctionToolCall,
): Promise<[Error] | [undefined, string]> {
  try {
    const toolName = toolCall.name as ToolName;
    const toolArgs = JSON.parse(toolCall.arguments);
    
    console.log('\n========== TOOL CALL ==========');
    console.log('[callFunction] Tool name:', toolName);
    console.log('[callFunction] Tool args:', toolArgs);
    console.log('===============================\n');
    
    // Handle search_decisions tool
    if (toolName === 'search_decisions') {
      console.log('[OpenAI] Calling search_decisions with query:', toolArgs.search_query);
      
      try {
        const searchService = getDecisionSearchService();
        
        // Parse the query to understand user intent
        let requestedLimit = 10; // default
        const query = toolArgs.search_query;
        const queryLower = query.toLowerCase();
        
        // First check if the query uses singular form (החלטה) vs plural (החלטות)
        const isSingularRequest = query.includes('החלטה') && !query.includes('החלטות');
        
        // Check if there's a number or quantity word in the query
        const hasExplicitNumber = /\d+/.test(query) || 
          /(שתיים|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע|עשר|כמה|הרבה|עוד)/i.test(query);
        
        // If singular form without explicit number, assume 1
        if (isSingularRequest && !hasExplicitNumber) {
          requestedLimit = 1;
          console.log('[OpenAI] Detected singular request without number - limiting to 1');
        } else {
          // Enhanced number detection patterns
          const numberPatterns = [
            // Hebrew patterns
            /(החלטה\s+אחת)/i,  // "החלטה אחת"
            /(אחת)\s+(החלטה|בלבד|מה)/i, // "אחת החלטה" or "אחת בלבד"
            /(רק\s+אחת)/i,  // "רק אחת"
            /(החלטה)\s+(יחידה|בודדת)/i, // "החלטה יחידה"
            // Number patterns
            /(\d+)\s*(החלטה|החלטות)/i,
            /(החלטה|החלטות)\s*(\d+)/i,
            // English patterns
            /(one|single)\s+(decision)/i,
            /(decision)\s+(one|only)/i,
            /(just|only)\s+(one)/i,
            /(\d+)\s*(decision|decisions)/i
          ];
        
          // Check all patterns
          for (const pattern of numberPatterns) {
            const match = queryLower.match(pattern);
            if (match) {
              // Check if it's a "one" pattern
              if (match[0].includes('אחת') || match[0].includes('יחיד') || 
                  match[0].includes('one') || match[0].includes('single') ||
                  match[0].includes('בודד')) {
                requestedLimit = 1;
                console.log('[OpenAI] Detected request for ONE decision');
                break;
              }
              // Check for numeric value
              const numMatch = match[0].match(/\d+/);
              if (numMatch) {
                requestedLimit = parseInt(numMatch[0]);
                console.log(`[OpenAI] Detected request for ${requestedLimit} decisions`);
                break;
              }
            }
          }
        }
        
        console.log(`[OpenAI] Final requested limit: ${requestedLimit}`);
        
        const decisions = await searchService.searchDecisions(toolArgs.search_query, Math.min(requestedLimit, 50));
        const formattedResponse = searchService.formatDecisionsResponse(decisions);
        
        // Get total count for better context
        const allDecisions = await searchService.searchDecisions(toolArgs.search_query, 1000);
        const totalFound = allDecisions.length;
        
        // Add context about what was found
        let contextResponse: string;
        if (decisions.length > 0) {
          contextResponse = `## 🔍 תוצאות חיפוש: "${toolArgs.search_query}"\n\n`;
          contextResponse += `נמצאו **${totalFound} החלטות** רלוונטיות מתוך ${searchService.getStatus().decisionCount} החלטות במאגר.\n`;
          
          if (requestedLimit === 1) {
            contextResponse += `הנה ההחלטה האחרונה בנושא:\n\n`;
          } else {
            contextResponse += `מוצגות **${decisions.length} ההחלטות האחרונות**:\n\n`;
          }
          
          contextResponse += `---\n\n${formattedResponse}\n\n---\n\n`;
          
          // Add helpful tips
          if (totalFound > decisions.length) {
            contextResponse += `💡 **טיפ:** נמצאו ${totalFound - decisions.length} החלטות נוספות. `;
            contextResponse += `אם תרצה לראות עוד, פשוט בקש "עוד החלטות" או ציין מספר ספציפי.\n\n`;
          }
          
          contextResponse += `🔎 **חיפושים נוספים שיכולים לעניין:**\n`;
          contextResponse += `- החלטות לפי משרד ספציפי (למשל: "החלטות משרד החינוך")\n`;
          contextResponse += `- החלטות מתקופה מסוימת (למשל: "החלטות מ-2024")\n`;
          contextResponse += `- החלטות בנושא משנה (למשל: "${toolArgs.search_query} תקציב")\n\n`;
          
          if (decisions.length <= 3) {
            contextResponse += `📊 אם תרצה, אוכל להעריך את איכות הביצוע של אחת מההחלטות הללו.`;
          }
        } else {
          contextResponse = `## ❌ לא נמצאו תוצאות\n\n`;
          contextResponse += `לא מצאתי החלטות ממשלה התואמות לחיפוש "${toolArgs.search_query}".\n\n`;
          contextResponse += `### 💡 הצעות לחיפוש משופר:\n\n`;
          contextResponse += `1. **נסה מילות מפתח אחרות** - למשל, אם חיפשת "בתי חולים", נסה "בריאות" או "מערכת הבריאות"\n`;
          contextResponse += `2. **ציין משרד ממשלתי** - "החלטות משרד הבריאות"\n`;
          contextResponse += `3. **הוסף טווח זמן** - "החלטות מ-2023" או "החלטות אחרונות"\n`;
          contextResponse += `4. **השתמש בנושא רחב יותר** - "תשתיות" במקום "כבישים"\n\n`;
          contextResponse += `דוגמאות לחיפושים מוצלחים: חינוך, בריאות, תקציב, ביטחון, דיור, תחבורה`;
        }
        
        return [undefined, contextResponse];
      } catch (error) {
        console.error('[OpenAI] Error in search_decisions:', error);
        return [undefined, 'מצטער, נתקלתי בבעיה בחיפוש החלטות. אנא נסה שוב.'];
      }
    }

    // Handle evaluation tools (existing code)
    if (toolName === 'evaluate_existing_decision') {
      // Search for evaluation via decision & gov number
      // If exists - return existing evaluation
      // Else -
      // Evaluate decision, return it
      // return
    }
  
    // Else - evaluate draft and return it
    const evaluationRes = await getEvaluatorResponse({
      newInput: [{ role: 'user', content: toolArgs.decision_text }],
      promptId: 'EVALUATION_PROMPT',
    })
  
    return [undefined, evaluationRes.output_text]
  } catch (error) {
    return [error as Error]
  }
}
