import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/layout/Navbar";
import ChatInterface from "@/components/chat/ChatInterface";

const Index = () => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState("");
  
  const presetOptions = [
    { title: "יש לי שאלה על החלטה", action: () => {} },
    { title: "העלאת קובץ החלטה", action: () => {} },
    { title: "יש לי מספר החלטה", action: () => {} },
    { title: "העלאת קובץ החלטה", action: () => {} },
    { title: "לפי תחום עניין", action: () => {} },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-ceci-blue flex items-center justify-center">
            <img 
              src="/lovable-uploads/e5bef460-0411-4a25-87dc-d161206e0479.png" 
              alt="CECI Logo" 
              className="h-8 w-8 object-contain"
            />
          </div>
          <span className="text-ceci-blue text-2xl font-heading font-bold">evaluator</span>
        </div>
        
        <nav className="hidden md:flex space-x-1 space-x-reverse">
          <Button variant="ghost" onClick={() => navigate('/')}>בית</Button>
          <Button variant="ghost" onClick={() => navigate('/about')}>אודות</Button>
          <Button variant="ghost" onClick={() => navigate('/rankings')}>דירוגים</Button>
          <Button variant="ghost" onClick={() => navigate('/methodology')}>איך אנחנו עובדים</Button>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center px-4 py-12 max-w-5xl mx-auto w-full">
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
        
        {/* Keep some of the original content in a hidden div that will be shown on other pages */}
        <div className="hidden">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ceci-dark mb-4">
              שאל את CECI ai
            </h2>
            <p className="text-lg text-ceci-gray max-w-2xl mx-auto">
              נסה את ממשק ה-AI השיחתי שלנו ושאל שאלות על החלטות ממשלה
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4 px-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} CECI ai. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
};

export default Index;
