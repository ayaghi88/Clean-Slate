import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { GenerateContentResponse } from '@google/genai';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  stateName: string;
  onGeneratePlan: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  stateName,
  onGeneratePlan
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <i className="fa-solid fa-gavel"></i>
          </div>
          <div>
            <h2 className="text-white font-semibold">{stateName} Assistant</h2>
            <p className="text-slate-400 text-xs">AI-Powered Legal Guide</p>
          </div>
        </div>
        <button 
          onClick={onGeneratePlan}
          className="hidden md:flex bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg transition-colors items-center space-x-2"
          disabled={messages.length < 3}
          title={messages.length < 3 ? "Chat a bit more first" : "Create Action Plan"}
        >
          <i className="fa-solid fa-list-check"></i>
          <span>See Action Plan</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              {/* Basic formatting for bold text if the AI returns it as markdown */}
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {msg.text.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your answer here..."
            className="flex-1 bg-slate-50 border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl px-6 transition-colors duration-200"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
        
        {/* Mobile View Action Plan Button */}
        <button 
          onClick={onGeneratePlan}
          className="md:hidden mt-3 w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
          disabled={messages.length < 3}
        >
          <i className="fa-solid fa-list-check"></i>
          <span>Generate Action Plan</span>
        </button>
      </div>
    </div>
  );
};