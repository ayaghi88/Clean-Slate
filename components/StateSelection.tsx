import React, { useState } from 'react';
import { US_STATES } from '../types';

interface StateSelectionProps {
  onSelectState: (state: string) => void;
}

export const StateSelection: React.FC<StateSelectionProps> = ({ onSelectState }) => {
  const [filter, setFilter] = useState('');

  const filteredStates = US_STATES.filter(state => 
    state.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Let's wipe the slate clean.
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto">
          Criminal record expungement laws are different in every state. Select yours to get a customized, step-by-step guide.
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-4 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-all"
            placeholder="Search for your state..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="mt-4 bg-white rounded-xl shadow-lg border border-slate-100 max-h-64 overflow-y-auto scrollbar-hide text-left">
          {filteredStates.length === 0 ? (
            <div className="p-4 text-slate-400 text-center">No state found</div>
          ) : (
            filteredStates.map(state => (
              <button
                key={state}
                onClick={() => onSelectState(state)}
                className="w-full text-left px-6 py-3 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between group"
              >
                <span className="font-medium">{state}</span>
                <i className="fa-solid fa-chevron-right opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500 text-sm"></i>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};