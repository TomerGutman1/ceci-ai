
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Navbar from "@/components/layout/Navbar";
import ChatInterface from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-ceci-dark mb-4">
                שאל את CECI ai
              </h2>
              <p className="text-lg text-ceci-gray max-w-2xl mx-auto">
                נסה את ממשק ה-AI השיחתי שלנו ושאל שאלות על החלטות ממשלה
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <ChatInterface />
            </div>
          </div>
        </section>
        
        <section className="py-20 px-4 bg-ceci-dark text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              המומחים שלנו
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  role: "מנהל מוצר בכיר",
                  exp: "8 שנות ניסיון בתחום ה-GovTech"
                },
                {
                  role: "מדען נתונים בכיר",
                  exp: "8 שנות ניסיון בתחום ה-GovTech"
                },
                {
                  role: "מפתח בכיר",
                  exp: "12 שנות ניסיון בתחום ה-GovTech"
                },
                {
                  role: "יועץ מומחה",
                  exp: "PhD, מנכ\"ל משרד ממשלתי לשעבר"
                }
              ].map((expert, idx) => (
                <div key={idx} className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                  <div className="w-20 h-20 rounded-full bg-ceci-blue mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{expert.role}</h3>
                  <p className="text-sm text-blue-200">{expert.exp}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16">
              <p className="text-xl mb-6">
                צוות המומחים שלנו משלב ידע נרחב בתחומי טכנולוגיה, מדיניות ציבורית וממשל
              </p>
              <Button className="bg-white text-ceci-dark hover:bg-gray-100">
                קרא עוד על הצוות שלנו
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-ceci-blue flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">C</span>
              </div>
              <span className="text-ceci-blue text-xl font-heading font-bold">evaluator</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-center md:text-right">
              <div>
                <h4 className="font-bold mb-2">מוצרים</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>ניתוח החלטות</li>
                  <li>תחזיות</li>
                  <li>דירוגים</li>
                  <li>דוחות</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">משאבים</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>מרכז ידע</li>
                  <li>בלוג</li>
                  <li>מחקרים</li>
                  <li>שאלות נפוצות</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2">חברה</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>אודות</li>
                  <li>צוות</li>
                  <li>שותפים</li>
                  <li>צור קשר</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CECI ai. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
