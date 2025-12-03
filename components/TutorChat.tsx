import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { MessageCircle, Minimize2, Send, Bot } from 'lucide-react';
import { Question } from '../types';
import { createTutorChat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface TutorChatProps {
  question: Question;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const TutorChat: React.FC<TutorChatProps> = ({ question }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatSession(createTutorChat(question));
    setMessages([{
      role: 'model',
      text: "Greetings, scholar. I am the Head Librarian. If you require assistance breaking down this problem, simply ask."
    }]);
    setInputValue('');
  }, [question.question_id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSession) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessage({ message: userMsg });
      const responseText = result.text;
      
      if (responseText) {
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I apologize, I seem to have lost my place in the archives. Please try asking again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{ zIndex: 9999 }}
        className="fixed bottom-6 right-6 bg-library-wood text-library-paper p-4 rounded-full shadow-2xl hover:bg-library-woodLight transition-all border-2 border-library-gold flex items-center gap-2"
      >
        <MessageCircle size={24} />
        <span className="font-serif font-bold hidden md:inline">Ask Librarian</span>
      </button>
    );
  }

  return (
    <div 
      style={{ zIndex: 9999 }}
      className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-lg shadow-2xl border-2 border-library-wood flex flex-col overflow-hidden animate-fade-in"
    >
      {/* Header - added flex-shrink-0 to prevent squishing */}
      <div className="flex-shrink-0 bg-library-wood text-library-paper p-4 flex justify-between items-center border-b-4 border-library-gold">
        <div className="flex items-center gap-2">
          <div className="bg-library-paper p-1.5 rounded-full text-library-wood">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-serif font-bold leading-none">Librarian's Desk</h3>
            <span className="text-xs text-library-paperDark opacity-80">AI Tutor</span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-library-paper hover:bg-white/10 p-1 rounded"
        >
          <Minimize2 size={20} />
        </button>
      </div>

      {/* Messages - added min-h-0 to force scrolling instead of growing */}
      <div className="flex-grow min-h-0 overflow-y-auto p-4 bg-library-paper space-y-4">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed shadow-sm break-words overflow-hidden ${
                msg.role === 'user' 
                  ? 'bg-library-woodLight text-white rounded-br-none' 
                  : 'bg-white text-library-ink border border-library-paperDark rounded-bl-none'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="underline" />,
                  p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />,
                  // Handle lists to ensure they don't break layout
                  ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 mb-2" />,
                  ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-4 mb-2" />,
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-library-ink border border-library-paperDark p-3 rounded-lg rounded-bl-none shadow-sm flex gap-1 items-center">
              <span className="w-2 h-2 bg-library-woodLight rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-library-woodLight rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-library-woodLight rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - added flex-shrink-0 to keep it stable */}
      <div className="flex-shrink-0 p-4 bg-white border-t border-library-paperDark">
        {messages.length === 1 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
            <button 
              onClick={() => { setInputValue("How do I solve this?"); handleSendMessage(); }}
              className="whitespace-nowrap text-xs px-3 py-1 rounded-full bg-library-paperDark text-library-wood border border-library-wood/20 hover:bg-library-wood/10 transition-colors"
            >
              How do I solve this?
            </button>
            <button 
              onClick={() => { setInputValue("Can you give me a hint?"); handleSendMessage(); }}
              className="whitespace-nowrap text-xs px-3 py-1 rounded-full bg-library-paperDark text-library-wood border border-library-wood/20 hover:bg-library-wood/10 transition-colors"
            >
              Give me a hint
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask the librarian..."
            className="flex-grow px-4 py-2 border border-library-paperDark rounded-md focus:outline-none focus:ring-2 focus:ring-library-wood/50 text-sm"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-library-green text-white p-2 rounded-md hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};