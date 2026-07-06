/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InvestmentInput } from './types';
import InputPage from './components/InputPage';
import ResultPage from './components/ResultPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'input' | 'result'>('input');
  const [savedInput, setSavedInput] = useState<InvestmentInput | undefined>(undefined);

  const handleFormSubmit = (input: InvestmentInput) => {
    setSavedInput(input);
    setCurrentPage('result');
    // Scroll back to top on page transition to ensure the scroll-based report starts from Hero
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleBackToInput = () => {
    setCurrentPage('input');
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleSelectAlternateRegion = (regionName: string) => {
    // Overwrite saved input region and recalculate
    if (savedInput) {
      const updatedInput = { ...savedInput, region: regionName };
      setSavedInput(updatedInput);
    } else {
      setSavedInput({
        region: regionName,
        purchasePrice: 7.5,
        loanRatio: 50,
        interestRate: 4.2,
        holdingPeriod: 4,
        tendency: 'neutral',
      });
    }
    setCurrentPage('result');
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500/30 selection:text-blue-900">
      {currentPage === 'input' ? (
        <InputPage 
          onSubmit={handleFormSubmit} 
          initialInput={savedInput} 
        />
      ) : (
        <ResultPage
          input={savedInput!}
          onBack={handleBackToInput}
          onSelectRegion={handleSelectAlternateRegion}
        />
      )}
    </main>
  );
}
