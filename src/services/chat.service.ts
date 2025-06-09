import { ChatEvent, ChatEventType, Message } from '@/types/streams';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api';

export class ChatService {
  private static instance: ChatService;
  
  private constructor() {}
  
  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(
    content: string, 
    conversationId?: string
  ): Promise<AsyncIterableIterator<ChatEvent>> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/jsonl; charset=utf-8',
      },
      body: JSON.stringify({
        newMessageContent: content,
        conversationId
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    return this.parseStreamingResponse(response);
  }

  private async *parseStreamingResponse(
    response: Response
  ): AsyncIterableIterator<ChatEvent> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body reader available');
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            const event = JSON.parse(line) as ChatEvent;
            yield event;
          } catch (error) {
            console.error('Failed to parse chat event:', error);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // Helper method to process events into messages
  processEventsToMessages(
    events: ChatEvent[], 
    currentMessages: Message[]
  ): Message[] {
    const messages = [...currentMessages];
    
    for (const event of events) {
      switch (event.type) {
        case ChatEventType.MessageAdded:
          messages.push(event.message);
          break;
          
        case ChatEventType.MessageDelta:
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            lastMessage.content += event.delta;
          }
          break;
          
        case ChatEventType.MessageCompleted:
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            lastMessage.content = event.text;
          }
          break;
      }
    }
    
    return messages;
  }
}

export default ChatService.getInstance();
