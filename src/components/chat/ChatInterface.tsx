import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import chatService from "@/services/chat.service";
import { ChatEvent, ChatEventType } from "@/types/streams";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  externalMessage?: { text: string; timestamp: number } | null;
}

const ChatInterface = ({ externalMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-message",
      role: "assistant",
      content: "שלום! אני יועץ ה-AI של CECI. כיצד אוכל לסייע לך בנושא החלטות ממשלה?",
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Ref for accumulating streaming content
  const streamingContentRef = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processNewMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(true);
    streamingContentRef.current = "";

    // Add empty assistant message for streaming
    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages((prev) => [...prev, {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }]);

    try {
      // Use the govainaTG backend through our service
      const eventStream = await chatService.sendMessage(text, conversationId);
      
      for await (const event of eventStream) {
        switch (event.type) {
          case ChatEventType.MessageCreated:
            if (event.conversationId) {
              setConversationId(event.conversationId);
            }
            break;
            
          case ChatEventType.MessageAdded:
            if (event.message) {
              setMessages(prev => [...prev, {
                ...event.message,
                timestamp: new Date(),
              }]);
              streamingContentRef.current = "";
            }
            break;
            
          case ChatEventType.MessageDelta:
            if (event.delta) {
              streamingContentRef.current += event.delta;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg && lastMsg.role === "assistant") {
                  lastMsg.content = streamingContentRef.current;
                }
                return [...newMessages];
              });
            }
            break;
            
          case ChatEventType.MessageCompleted:
            if (event.text) {
              streamingContentRef.current = event.text;
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg && lastMsg.role === "assistant") {
                  lastMsg.content = event.text;
                }
                return [...newMessages];
              });
            }
            setIsStreaming(false);
            break;
        }
      }
    } catch (error) {
      console.error('Error calling govainaTG backend:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בחיבור ליועץ ה-AI. אנא נסה שוב.",
        variant: "destructive",
      });
      
      // Update last message with error
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          lastMsg.content = "מצטער, אירעה שגיאה טכנית. אנא נסה שוב.";
        }
        return [...newMessages];
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    processNewMessage(inputMessage);
    setInputMessage("");
  };

  useEffect(() => {
    if (externalMessage && externalMessage.text) {
      processNewMessage(externalMessage.text);
    }
  }, [externalMessage]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Custom renderer for messages with Markdown support
  const MessageContent = ({ content, role }: { content: string; role: string }) => {
    if (role === "user") {
      return <p className="text-sm whitespace-pre-wrap">{content}</p>;
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="text-sm prose prose-sm max-w-none prose-blue"
        components={{
          // Custom link renderer to open in new tab
          a: ({ node, children, ...props }) => (
            <a 
              {...props} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              {children}
            </a>
          ),
          // Custom rendering for lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
          ),
          // Custom rendering for paragraphs
          p: ({ children }) => (
            <p className="mb-2 last:mb-0">{children}</p>
          ),
          // Custom rendering for headings
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mt-2 mb-1">{children}</h3>
          ),
          // Custom rendering for bold text
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          // Custom rendering for horizontal rules
          hr: () => <hr className="my-3 border-gray-300" />,
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-gray-200 w-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-lg">יועץ ה-AI של CECI</h2>
        <p className="text-sm text-gray-500">שאל שאלות על החלטות ממשלה וקבל תשובות בזמן אמת</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
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
              <MessageContent content={message.content} role={message.role} />
              <span className="text-xs opacity-70 mt-1 self-end">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        
        {(isLoading && !isStreaming) && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-e-2xl rounded-es-2xl p-3">
              <div className="flex space-x-2 space-x-reverse">
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
          dir="rtl"
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
