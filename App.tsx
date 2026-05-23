import React, { useState, useRef, useEffect } from 'react';
import { DisclaimerModal } from './components/DisclaimerModal';
import { StateSelection } from './components/StateSelection';
import { ChatInterface } from './components/ChatInterface';
import { RoadmapView } from './components/RoadmapView';
import { createExpungementChat, generateRoadmapFromHistory } from './services/gemini';
import { Message, Roadmap } from './types';
import { Chat, GenerateContentResponse } from '@google/genai';

const App: React.FC = () => {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(false);
  
  // Use a ref to hold the chat instance so it persists across renders
  const chatSessionRef = useRef<Chat | null>(null);

  // Initialize chat when state is selected
  useEffect(() => {
    if (selectedState && !chatSessionRef.current) {
      initializeChat(selectedState);
    }
  }, [selectedState]);

  const initializeChat = async (state: string) => {
    setIsLoading(true);
    try {
      const chat = createExpungementChat(state);
      chatSessionRef.current = chat;

      // Initial system trigger to start the conversation nicely
      const initPrompt = `I live in ${state}. Please introduce yourself as CleanSlate and ask me the first screening question to determine if my record can be expunged. Keep it simple.`;
      
      const result: GenerateContentResponse = await chat.sendMessage({ message: initPrompt });
      const text = result.text || "Hello! I'm ready to help you.";
      
      setMessages([{ role: 'model', text }]);
    } catch (error) {
      console.error("Failed to start chat:", error);
      setMessages([{ role: 'model', text: "I'm having trouble connecting to the legal database right now. Please refresh and try again.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!chatSessionRef.current) return;

    // Optimistic update
    const newMessages: Message[] = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({ message: text });
      const responseText = result.text || "I didn't catch that. Could you rephrase?";
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing that. Please try again.", isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!selectedState) return;
    setIsLoading(true);
    
    try {
      // Convert chat history to text format for the summarizer
      const historyText = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
      const generatedMap = await generateRoadmapFromHistory(selectedState, historyText);
      setRoadmap(generatedMap);
      setShowRoadmap(true);
    } catch (error) {
      console.error("Roadmap generation error:", error);
      alert("Could not generate roadmap. Please try chatting a bit more first.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedState(null);
    setMessages([]);
    setRoadmap(null);
    setShowRoadmap(false);
    chatSessionRef.current = null;
  };

  // Render Logic
  if (!disclaimerAccepted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <StateSelection onSelectState={() => {}} /> {/* Background visual */}
        <DisclaimerModal onAccept={() => setDisclaimerAccepted(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleReset}>
             <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                <i className="fa-solid fa-eraser"></i>
             </div>
             <span className="text-xl font-bold text-slate-900">CleanSlate</span>
          </div>
          {selectedState && (
             <button onClick={handleReset} className="text-sm text-slate-500 hover:text-slate-900 font-medium">
               Change State
             </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {!selectedState ? (
          <div className="animate-fade-in">
             <StateSelection onSelectState={setSelectedState} />
             
             {/* Features Grid */}
             <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto no-print">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-xl">
                    <i className="fa-solid fa-scale-unbalanced"></i>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">State Specific Laws</h3>
                  <p className="text-slate-600">Our AI uses up-to-date legal statutes tailored to your specific jurisdiction.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4 text-xl">
                    <i className="fa-regular fa-comments"></i>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Simple English</h3>
                  <p className="text-slate-600">No legalese. We translate complex court requirements into 5th-grade reading level steps.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-xl">
                    <i className="fa-solid fa-list-check"></i>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Actionable Roadmap</h3>
                  <p className="text-slate-600">Get a clear checklist of forms, fees, and filing locations if you qualify.</p>
                </div>
             </div>
          </div>
        ) : !showRoadmap ? (
          <div className="max-w-3xl mx-auto animate-fade-in">
             <div className="mb-6 no-print">
                <button onClick={() => setSelectedState(null)} className="text-slate-500 hover:text-slate-800 mb-4 flex items-center space-x-2">
                  <i className="fa-solid fa-arrow-left"></i>
                  <span>Back to State Selection</span>
                </button>
             </div>
             <ChatInterface 
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                stateName={selectedState}
                onGeneratePlan={handleGenerateRoadmap}
             />
             <div className="text-center mt-6 text-slate-400 text-sm no-print">
               <p>AI can make mistakes. Please verify important info.</p>
             </div>
          </div>
        ) : (
          <RoadmapView 
            roadmap={roadmap} 
            onReset={handleReset} 
            onBackToChat={() => setShowRoadmap(false)}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto no-print">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CleanSlate. Not a law firm.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;