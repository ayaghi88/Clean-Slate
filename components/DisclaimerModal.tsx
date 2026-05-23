import React from 'react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-scale-balanced text-xl"></i>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Important Disclaimer</h2>
        </div>
        
        <div className="prose prose-sm text-slate-600 mb-6">
          <p>
            <strong>CleanSlate is an educational tool powered by AI.</strong> We are not a law firm, and this app does not provide legal advice.
          </p>
          <p>
            Expungement laws vary by state and are subject to change. The information provided here should not be used as a substitute for professional legal counsel.
          </p>
          <p>
            By continuing, you agree that you understand this limitation and will verify all information with a qualified attorney or the court clerk in your jurisdiction.
          </p>
        </div>

        <button
          onClick={onAccept}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};