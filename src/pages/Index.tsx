
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface";

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
      <div className="text-center mb-8 mt-8">
        <h2 className="text-2xl font-bold mb-6">במה אוכל לסייע לך היום?</h2>
        <h1 className="text-lg mb-4 text-ceci-dark">
          היי, אני היועץ AI של המרכז להעצמת האזרח לבחינת עבודת הממשלה. אז מה אני יודע לעשות?
        </h1>
        <p className="text-lg text-ceci-gray mb-8">
          כרגע להעריך יישומות החלטות ממשלה. רוצה לנסות? על מנת להתחיל בחר/י בחירה מוגדרת מראש או שוחח/י אותי בצ׳אט.
        </p>
      </div>
      
      {/* Preset Options */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
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
      
      {/* Chat Interface Component */}
      <div className="w-full flex-grow flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;
