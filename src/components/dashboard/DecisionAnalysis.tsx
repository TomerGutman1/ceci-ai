
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface DecisionData {
  id: string;
  title: string;
  number: string;
  date: string;
  category: string;
  feasibilityScore: number;
  implementationStatus: number;
  strengths: string[];
  weaknesses: string[];
  budget?: string;
  responsibleParty?: string;
  timeline?: string;
  relatedDecisions?: string[];
  description?: string;
}

const sampleDecisions: DecisionData[] = [
  {
    id: "1",
    title: "תוכנית לאומית להתייעלות אנרגטית",
    number: "4095",
    date: "12.10.2023",
    category: "אנרגיה וסביבה",
    feasibilityScore: 72,
    implementationStatus: 45,
    description: "החלטה על קידום תוכנית לאומית להתייעלות אנרגטית במטרה להפחית את צריכת האנרגיה במשק ב-17% עד שנת 2030.",
    budget: "750 מיליון ₪",
    responsibleParty: "משרד האנרגיה",
    timeline: "5 שנים",
    relatedDecisions: ["3786", "4125"],
    strengths: [
      "תקציב מוגדר",
      "לוח זמנים ריאלי",
      "גורם אחראי מוגדר"
    ],
    weaknesses: [
      "תלות בשיתוף פעולה בין-משרדי",
      "חסרה מתודולוגיית מדידה"
    ]
  },
  {
    id: "2",
    title: "רפורמה בתחום הדיור",
    number: "3982",
    date: "01.08.2023",
    category: "תשתיות",
    feasibilityScore: 58,
    implementationStatus: 25,
    description: "רפורמה בתחום הדיור הכוללת האצת הליכי תכנון ובנייה, הפשרת קרקעות לבנייה והגדלת היצע הדירות בשוק.",
    budget: "1.2 מיליארד ₪",
    responsibleParty: "משרד הבינוי והשיכון",
    timeline: "3 שנים",
    relatedDecisions: ["3675", "3912"],
    strengths: [
      "תיעדוף פוליטי גבוה",
      "תקציב משמעותי"
    ],
    weaknesses: [
      "חקיקה נדרשת מורכבת",
      "התנגדויות מצד בעלי עניין",
      "לוח זמנים לא ריאלי"
    ]
  },
  {
    id: "3",
    title: "התייעלות במערכת הבריאות",
    number: "4021",
    date: "23.09.2023",
    category: "בריאות",
    feasibilityScore: 84,
    implementationStatus: 60,
    description: "החלטה על תוכנית להתייעלות במערכת הבריאות הציבורית, כולל קיצור תורים, שיפור השירות וחיסכון בעלויות תפעול.",
    budget: "500 מיליון ₪",
    responsibleParty: "משרד הבריאות",
    timeline: "2 שנים",
    relatedDecisions: ["3890"],
    strengths: [
      "מטרות מדידות וברורות",
      "גורם אחראי מוגדר",
      "תקציב מוגדר"
    ],
    weaknesses: [
      "תלות בשינוי תרבות ארגונית"
    ]
  }
];

const DecisionAnalysis = () => {
  const [selectedDecision, setSelectedDecision] = useState<DecisionData | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const getFeasibilityColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 75) return "bg-green-600";
    if (score >= 50) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            תצוגת כרטיסיות
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            תצוגת טבלה
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleDecisions.map((decision) => (
            <Card 
              key={decision.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => setSelectedDecision(decision)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{decision.title}</CardTitle>
                <CardDescription>מס׳ החלטה: {decision.number} | {decision.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{decision.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">סיכויי יישום:</span>
                      <span className={`font-bold ${getFeasibilityColor(decision.feasibilityScore)}`}>
                        {decision.feasibilityScore}%
                      </span>
                    </div>
                    <Progress 
                      value={decision.feasibilityScore} 
                      className="h-2"
                      indicatorClassName={getProgressColor(decision.feasibilityScore)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">סטטוס יישום:</span>
                      <span className="font-bold">
                        {decision.implementationStatus}%
                      </span>
                    </div>
                    <Progress 
                      value={decision.implementationStatus} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">תקציב:</span>
                      <p className="text-gray-600">{decision.budget || "לא מוגדר"}</p>
                    </div>
                    <div>
                      <span className="font-medium">גורם אחראי:</span>
                      <p className="text-gray-600">{decision.responsibleParty || "לא מוגדר"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDecision(decision);
                  }}
                >
                  ניתוח מפורט
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>מס׳ החלטה</TableHead>
                  <TableHead>כותרת</TableHead>
                  <TableHead>תאריך</TableHead>
                  <TableHead>תחום</TableHead>
                  <TableHead>סיכויי יישום</TableHead>
                  <TableHead>סטטוס נוכחי</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleDecisions.map((decision) => (
                  <TableRow key={decision.id} className="cursor-pointer" onClick={() => setSelectedDecision(decision)}>
                    <TableCell>{decision.number}</TableCell>
                    <TableCell>{decision.title}</TableCell>
                    <TableCell>{decision.date}</TableCell>
                    <TableCell>{decision.category}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${getFeasibilityColor(decision.feasibilityScore)}`}>
                        {decision.feasibilityScore}%
                      </span>
                    </TableCell>
                    <TableCell>{decision.implementationStatus}%</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDecision(decision);
                        }}
                      >
                        פרטים
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedDecision && (
        <Card className="shadow-sm mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>ניתוח מפורט - {selectedDecision.title}</CardTitle>
              <CardDescription>
                מס׳ החלטה: {selectedDecision.number} | תאריך: {selectedDecision.date} | תחום: {selectedDecision.category}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedDecision(null)}
            >
              סגור
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="summary">סיכום</TabsTrigger>
                <TabsTrigger value="details">פרטים מלאים</TabsTrigger>
                <TabsTrigger value="factors">גורמים משפיעים</TabsTrigger>
                <TabsTrigger value="recommendations">המלצות</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-6">
                <div>
                  <p className="mb-4">{selectedDecision.description}</p>
                </div>
              
                <div>
                  <h4 className="font-medium mb-2">סיכויי יישום</h4>
                  <div className="flex items-center gap-4">
                    <Progress 
                      value={selectedDecision.feasibilityScore} 
                      className="h-3 flex-1"
                      indicatorClassName={getProgressColor(selectedDecision.feasibilityScore)}
                    />
                    <span className={`text-xl font-bold ${getFeasibilityColor(selectedDecision.feasibilityScore)}`}>
                      {selectedDecision.feasibilityScore}%
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">סטטוס יישום נוכחי</h4>
                  <div className="flex items-center gap-4">
                    <Progress 
                      value={selectedDecision.implementationStatus} 
                      className="h-3 flex-1"
                    />
                    <span className="text-xl font-bold">
                      {selectedDecision.implementationStatus}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">חוזקות</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedDecision.strengths.map((strength, index) => (
                        <li key={index} className="text-sm">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-red-600">חולשות</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedDecision.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">תקציב</h4>
                      <p>{selectedDecision.budget || "לא מוגדר"}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">גורם אחראי</h4>
                      <p>{selectedDecision.responsibleParty || "לא מוגדר"}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">לוח זמנים</h4>
                      <p>{selectedDecision.timeline || "לא מוגדר"}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-1">החלטות קשורות</h4>
                      {selectedDecision.relatedDecisions && selectedDecision.relatedDecisions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedDecision.relatedDecisions.map((decision) => (
                            <Button key={decision} variant="outline" size="sm">
                              החלטה {decision}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p>אין החלטות קשורות</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">תיאור מלא</h4>
                      <p>{selectedDecision.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="factors" className="py-4">
                <div className="space-y-4">
                  <p>הגורמים המשפיעים ביותר על סיכויי היישום של החלטה זו:</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">תקציב מספק</span>
                        <span className="text-sm font-medium">גבוה</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">הגדרת גורם אחראי</span>
                        <span className="text-sm font-medium">בינוני-גבוה</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">לוח זמנים ריאלי</span>
                        <span className="text-sm font-medium">בינוני</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">מורכבות בירוקרטית</span>
                        <span className="text-sm font-medium">בינוני-נמוך</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">תמיכה פוליטית</span>
                        <span className="text-sm font-medium">נמוך</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="py-4">
                <div className="space-y-4">
                  <p className="font-medium">להגברת סיכויי היישום של החלטה זו, מומלץ:</p>
                  
                  <ul className="list-decimal list-inside space-y-2 mr-4">
                    <li>הגדרת מדדי הצלחה ברורים ומדידים</li>
                    <li>הקצאת משאבים נוספים לגורם המיישם</li>
                    <li>פישוט תהליכים בירוקרטיים הקשורים ליישום</li>
                    <li>שיפור התיאום הבין-משרדי</li>
                    <li>קביעת נקודות בקרה תקופתיות לבחינת התקדמות</li>
                  </ul>
                  
                  <div className="mt-6">
                    <Button className="bg-ceci-blue hover:bg-blue-700">
                      צור דוח המלצות מפורט
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DecisionAnalysis;
