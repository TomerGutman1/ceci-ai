
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [inputMessage, setInputMessage] = useState("");
  
  const presetOptions = [
    { title: "יש לי שאלה על החלטה", action: () => {} },
    { title: "העלאת קובץ החלטה", action: () => {} },
    { title: "יש לי מספר החלטה", action: () => {} },
    { title: "לפי תחום עניין", action: () => {} },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col h-full px-4">
      {/* Welcome Message - Moved to top */}
      <div className="text-center mb-12 mt-8" id="chat-description">
        <h2 className="text-2xl font-bold mb-6">במה אוכל לסייע לך היום?</h2>
        <h1 className="text-lg mb-4 text-ceci-dark">
          היי, אני היועץ AI של המרכז להעצמת האזרח לבחינת עבודת הממשלה. אז מה אני יודע לעשות?
        </h1>
        <p className="text-lg text-ceci-gray">
          כרגע להעריך יישומות החלטות ממשלה. רוצה לנסות? על מנת להתחיל בחר/י בחירה מוגדרת מראש או שוחח/י אותי בצ׳אט.
        </p>
      </div>

      <div id="chat-body">
        {/* Preset Options */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {presetOptions.map((option, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center h-10 gap-3 px-4 bg-white rounded-full border border-gray-200 hover:border-ceci-blue cursor-pointer transition-all w-[200px]"
              onClick={option.action}
            >
              <span className="font-medium text-center">{option.title}</span>
            </div>
          ))}
        </div>
        
        {/* Spacer to push chat to bottom */}
        <div className="flex-grow"></div>
        
        {/* Chat Input - Aligned with login button */}
        <div className="w-full mt-auto mb-4 px-4 sm:px-8 flex items-center">
          <div className="relative w-full max-w-3xl">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="שאל/י אותי משהו..."
              className="pr-12 py-6 text-lg rounded-full"
            />
            <Button 
              className="absolute left-1 top-1 rounded-full h-10 w-10 p-0" 
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
