
import { useState } from "react";
import ChatInterface from "@/components/chat/ChatInterface"; // Updated import path

const Index = () => {
  const [chatTriggerMessage, setChatTriggerMessage] = useState<{ text: string; timestamp: number } | null>(null);
  
  const presetOptions = [
    { title: "יש לי שאלה על החלטה", action: () => setChatTriggerMessage({ text: "יש לי שאלה על החלטה", timestamp: Date.now() }) },
    { title: "העלאת קובץ החלטה", action: () => setChatTriggerMessage({ text: "העלאת קובץ החלטה", timestamp: Date.now() }) }, // Placeholder for actual file upload logic
    { title: "יש לי מספר החלטה", action: () => setChatTriggerMessage({ text: "יש לי מספר החלטה", timestamp: Date.now() }) },
    { title: "לפי תחום עניין", action: () => setChatTriggerMessage({ text: "לפי תחום עניין", timestamp: Date.now() }) },
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

      <div id="chat-body" className="flex flex-col flex-grow"> {/* Added flex-col and flex-grow here */}
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
        
        {/* Spacer to push chat to bottom - replaced by flex-grow on parent */}
        {/* <div className="flex-grow"></div> */} 
        
        {/* ChatInterface replaces the old input - Aligned with login button */}
        <div className="w-full mt-auto mb-4 flex justify-center"> {/* Removed px-4 sm:px-8, added justify-center */}
          <div className="w-full max-w-3xl"> {/* Ensure ChatInterface doesn't exceed this width */}
            <ChatInterface externalMessage={chatTriggerMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
