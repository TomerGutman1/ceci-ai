
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "שלום! אני יועץ ה-AI של CECI. כיצד אוכל לסייע לך בנושא החלטות ממשלה?",
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let response: string;
      
      if (inputMessage.includes("החלטה") || inputMessage.includes("ממשלה")) {
        response = "לפי הניתוח שלי, החלטות ממשלה בתחום זה מראות אחוזי יישום של כ-65%. הגורמים המרכזיים המשפיעים על הצלחת היישום הם תקצוב מספק, הגדרת גורם אחראי ברור ולוח זמנים ריאלי.";
      } else if (inputMessage.includes("מספר")) {
        response = "כדי לנתח החלטת ממשלה ספציפית, אנא ספק את מספר ההחלטה המלא ואוכל לספק ניתוח מפורט על הסיכויים ליישומה והאתגרים הצפויים.";
      } else {
        response = "אני יכול לעזור בניתוח החלטות ממשלה, הערכת סיכויי היישום שלהן, וזיהוי אתגרים אפשריים בתהליך היישום. אנא ציין החלטה ספציפית או תחום מדיניות שמעניין אותך.";
      }
      
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">יועץ ה-AI של CECI</h2>
        <p className="text-sm text-gray-500">שאל שאלות על החלטות ממשלה וקבל תשובות בזמן אמת</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-start flex-row-reverse" : "justify-start"
            }`}
          >
            <div
              className={`flex flex-col max-w-[80%] ${
                message.role === "user"
                  ? "bg-ceci-blue text-white rounded-s-2xl rounded-se-2xl"
                  : "bg-gray-100 text-gray-800 rounded-e-2xl rounded-es-2xl"
              } p-3`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 self-end">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-e-2xl rounded-es-2xl p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="הקלד את שאלתך כאן..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-ceci-blue hover:bg-blue-700"
          disabled={isLoading || !inputMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
