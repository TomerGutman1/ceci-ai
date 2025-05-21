
import { ReactNode } from "react";
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInset
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, BarChart3, FileText, MessageSquare, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Swapped order to put home page first, then chat
  const sidebarItems = [
    { title: "דף הבית", icon: Home, url: "/dashboard" },
    { title: "צ'אט עם CECI", icon: MessageSquare, url: "/" },
    { title: "דירוגים", icon: BarChart3, url: "/rankings" },
    { title: "החלטות", icon: FileText, url: "/methodology" },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        {/* סרגל צד ימני */}
        <Sidebar side="right" variant="sidebar" collapsible="offcanvas">
          <SidebarRail />
          <SidebarContent>
            {/* לוגו */}
            <div className="flex items-center justify-center p-4 border-b border-gray-200 mb-4">
              <img 
                src="/lovable-uploads/b7118ccc-f6d9-49b8-b34d-4a7f9b454adf.png" 
                alt="CECI Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>

            {/* חיפוש */}
            <div className="px-3 mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="חיפוש..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 pr-10 h-9 text-right rounded-full"
                />
              </div>
            </div>

            {/* תפריט - ללא כותרת */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        isActive={location.pathname === item.url} 
                        onClick={() => navigate(item.url)}
                        tooltip={item.title}
                        className="rounded-full"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* כפתור התחברות - adjusted positioning to align with chat input */}
            <div className="absolute bottom-6 right-0 left-0 px-4">
              <Button 
                className="w-full bg-ceci-blue hover:bg-blue-700 rounded-full" 
                onClick={() => navigate('/dashboard')}
              >
                התחברות / הרשמה
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* תוכן עיקרי */}
        <SidebarInset className="p-6 relative">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
