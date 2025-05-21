
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
    { title: "העלאת קובץ החלטה", action: () => {} },
    { title: "לפי תחום עניין", action: () => {} },
  ];

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Welcome Message */}
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-ceci-dark">
          היי, אני היועץ AI של המרכז להעצמת האזרח לבחינת עבודת הממשלה. אז מה אני יודע לעשות?
        </h1>
        <p className="text-xl text-ceci-gray">
          כרגע להעריך יישומות החלטות ממשלה. רוצה לנסות? על מנת להתחיל בחר/י בחירה מוגדרת מראש או שוחח/י אותי בצ׳אט.
        </p>
      </div>
      
      {/* Preset Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 w-full">
        {presetOptions.map((option, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-3 p-4 bg-white rounded-md border border-gray-200 hover:border-ceci-blue cursor-pointer transition-all"
            onClick={option.action}
          >
            <span className="font-medium">{option.title}</span>
          </div>
        ))}
      </div>
      
      {/* Chat Question */}
      <div className="text-center mb-8 w-full">
        <h2 className="text-3xl font-bold mb-4">במה אוכל לסייע לך היום?</h2>
      </div>
      
      {/* Chat Input */}
      <div className="relative w-full max-w-3xl mx-auto">
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
  );
};

export default Index;
