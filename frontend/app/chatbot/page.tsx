'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PaperclipIcon, SendIcon } from 'lucide-react'
import axios from 'axios'

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickActions = [
  "Explain a concept",
  "Get a recommendation",
  "Summarize my progress"
];

const API_BASE_URL = 'http://127.0.0.1:8000';

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    console.log('Full API URL:', `${API_BASE_URL}/chat/send/`);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat/send/`, { message: inputMessage });
      console.log('Raw API Response:', response.data);

      let botResponseContent = 'Sorry, I couldn\'t process that request.';

      // Check if the response is HTML
      if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
        console.log('Received HTML response');
        botResponseContent = 'I received a response, but it was in an unexpected format. Please try again.';
      } else if (typeof response.data === 'object' && response.data.response) {
        botResponseContent = response.data.response;
      } else {
        console.log('Unexpected response format:', typeof response.data);
      }

      // Add a 3-second delay before showing the bot's response
      await new Promise(resolve => setTimeout(resolve, 3000));

      const botResponse: Message = {
        id: messages.length + 2,
        content: botResponseContent,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
  };

  const handleAttachment = () => {
    setShowComingSoon(prev => !prev);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ask Your Assistant</CardTitle>
          <CardDescription>
            Get instant answers, explanations, and personalized recommendations to enhance your learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] pr-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/bot-avatar.png" alt="Bot" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
                  Assistant is typing...
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <div className="flex space-x-2 mb-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
              >
                {action}
              </Button>
            ))}
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={handleAttachment}
                title="Attach file"
              >
                <PaperclipIcon className="h-4 w-4" />
              </Button>
              {showComingSoon && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow-md border border-gray-200 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-t-white">
                  Coming Soon
                </div>
              )}
            </div>
            <Input
              type="text"
              placeholder="Type your message here..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-grow"
            />
            <Button onClick={handleSendMessage} title="Send message">
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" size="sm" onClick={handleClearChat}>
              Clear Chat
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

