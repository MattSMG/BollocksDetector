'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ isAI: boolean; confidence: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);

    // Symulacja analizy - tutaj możesz dodać prawdziwą integrację z API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Prosta heurystyka do wykrywania AI
    const aiIndicators = [
      /w dzisiejszych czasach/i,
      /chciałbym się podzielić/i,
      /jestem dumny/i,
      /to dla mnie ważne/i,
      /journey/i,
      /excited to announce/i,
      /proud to share/i,
      /game changer/i,
      /deep dive/i,
      /leverage/i,
    ];

    let aiScore = 0;
    aiIndicators.forEach(indicator => {
      if (indicator.test(text)) {
        aiScore += 15;
      }
    });

    // Sprawdzenie długości zdań i powtarzalności
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;

    if (avgLength > 100) aiScore += 10;
    if (avgLength < 30) aiScore -= 10;

    const confidence = Math.min(95, Math.max(5, aiScore + Math.random() * 20));
    const isAI = confidence > 50;

    setResult({ isAI, confidence: Math.round(confidence) });
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bollocks Detector
          </h1>
          <p className="text-lg text-gray-600">
            Sprawdź czy post na LinkedIn został napisany przez AI
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
              Wklej treść posta LinkedIn
            </label>
            <textarea
              id="text-input"
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Dzisiaj chciałbym się podzielić moją refleksją na temat..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button
            onClick={analyzeText}
            disabled={!text.trim() || isAnalyzing}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Analizuję...
              </>
            ) : (
              'Sprawdź tekst'
            )}
          </button>

          {result && (
            <div className={`mt-6 p-6 rounded-lg ${
              result.isAI ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'
            }`}>
              <div className="flex items-center mb-3">
                {result.isAI ? (
                  <AlertCircle className="text-red-600 mr-2" size={24} />
                ) : (
                  <CheckCircle2 className="text-green-600 mr-2" size={24} />
                )}
                <h3 className={`text-xl font-bold ${
                  result.isAI ? 'text-red-800' : 'text-green-800'
                }`}>
                  {result.isAI ? 'Prawdopodobnie AI' : 'Prawdopodobnie człowiek'}
                </h3>
              </div>
              <p className={`text-sm ${
                result.isAI ? 'text-red-700' : 'text-green-700'
              }`}>
                Pewność: {result.confidence}%
              </p>
              <p className="mt-3 text-sm text-gray-600">
                {result.isAI
                  ? 'Ten tekst zawiera wiele wskaźników charakterystycznych dla treści generowanych przez AI.'
                  : 'Ten tekst wydaje się być napisany przez człowieka.'}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Narzędzie ma charakter humorystyczny i nie gwarantuje 100% dokładności</p>
        </div>
      </div>
    </div>
  );
}
