import React from 'react';
import { Roadmap } from '../types';

interface RoadmapViewProps {
  roadmap: Roadmap | null;
  onReset: () => void;
  onBackToChat: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmap, onReset, onBackToChat }) => {
  if (!roadmap) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Likely Eligible': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Likely Ineligible': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="roadmap-container bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Action Plan</h2>
          <p className="text-slate-400 text-sm">Based on your conversation</p>
        </div>
        <div className="flex space-x-2 no-print">
           <button 
             onClick={() => window.print()}
             className="bg-slate-800 hover:bg-slate-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
           >
             <i className="fa-solid fa-print"></i>
             <span>Print / Save</span>
           </button>
           <button onClick={onBackToChat} className="text-slate-300 hover:text-white text-sm px-3 py-1 rounded-md border border-slate-700 hover:border-slate-500 transition-colors">
            Back
           </button>
           <button onClick={onReset} className="text-white hover:text-emerald-400 transition-colors px-2">
            <i className="fa-solid fa-rotate-right text-lg"></i>
           </button>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        {/* Status Banner */}
        <div className={`p-4 rounded-xl border ${getStatusColor(roadmap.eligibilityStatus)} flex items-start space-x-4 print:border-2`}>
          <div className="mt-1">
             {roadmap.eligibilityStatus === 'Likely Eligible' && <i className="fa-solid fa-circle-check text-xl"></i>}
             {roadmap.eligibilityStatus === 'Likely Ineligible' && <i className="fa-solid fa-circle-xmark text-xl"></i>}
             {roadmap.eligibilityStatus === 'Complex/Uncertain' && <i className="fa-solid fa-circle-exclamation text-xl"></i>}
          </div>
          <div>
            <h3 className="font-bold text-lg">{roadmap.eligibilityStatus}</h3>
            <p className="mt-1 opacity-90">{roadmap.summary}</p>
          </div>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Recommended Steps</h3>
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-10 pb-4">
            {roadmap.steps.map((step, idx) => (
              <div key={idx} className="relative pl-8">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm print:bg-black"></div>
                
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:shadow-md transition-shadow print:bg-white print:border-slate-300">
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{idx + 1}. {step.title}</h4>
                  <p className="text-slate-600 mb-4">{step.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    {step.estimatedCost && (
                      <div className="flex items-center text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 print:border-slate-400">
                        <i className="fa-solid fa-tag mr-2 text-emerald-500 print:text-black"></i>
                        Cost: {step.estimatedCost}
                      </div>
                    )}
                    
                    {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                      <div className="flex flex-col w-full mt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 print:text-black">Documents needed</span>
                        <div className="flex flex-wrap gap-2">
                          {step.requiredDocuments.map((doc, i) => (
                            <span key={i} className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 print:bg-white print:text-black print:border-slate-400">
                              <i className="fa-regular fa-file mr-1"></i> {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800 text-sm flex items-start space-x-3 print:bg-white print:border-slate-300 print:text-slate-600">
           <i className="fa-solid fa-info-circle mt-0.5"></i>
           <p>This roadmap is generated by AI based on the details you provided. Legal procedures are strict regarding paperwork and deadlines. We strongly recommend consulting with a legal aid organization or attorney in your state before filing any official documents.</p>
        </div>
        
        <div className="hidden print:block text-center mt-8 text-xs text-slate-400 border-t pt-4">
           Generated by CleanSlate • Not Legal Advice
        </div>
      </div>
    </div>
  );
};