'use client';

import React, { useState } from 'react';
import { AlertCircle, Sparkles, TrendingUp, Shield } from 'lucide-react';

interface AnalysisResult {
  combined_score: number;
  perplexity: {
    score: number;
    perplexity: number;
    mean_logprob: number;
    entropy: number;
    rank_histogram: Record<string, number>;
  };
  binoculars: {
    score: number;
    perplexity_a: number;
    perplexity_b: number;
    ratio: number;
  };
}

export default function BollocksDetector() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const analyzeText = async () => {
    if (text.length < 50) {
      setError('Tekst musi mieć minimum 50 znaków');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: 'pl' })
      });

      if (!response.ok) throw new Error('Błąd analizy');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Nie udało się przeanalizować tekstu. Spróbuj ponownie.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAIPercentage = () => {
    if (!result) return 0;
    return Math.round(result.combined_score * 100);
  };

  const getConfidenceColor = () => {
    const percentage = getAIPercentage();
    if (percentage >= 70) return 'text-red-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-white font-sans">
      {/* Header */}
      <header className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-purple-300" />
          <h1 className="text-3xl font-light tracking-wide">Bollocks Detector</h1>
        </div>
        <p className="text-purple-200 text-sm font-light ml-11">
          AI Content Detection for LinkedIn
        </p>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-16 max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-8 shadow-2xl">
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-light mb-3">Jak to działa?</h2>
            <p className="text-purple-200 text-sm leading-relaxed mb-4">
              Chcesz sprawdzić czy Twój „ulubiony" twórca na LinkedIn naprawdę chce przekazać 
              coś wartościowego czy tylko wrzuca generyczne teksty z AI?
            </p>
            
            {/* Disclaimer */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-100">
                <strong className="font-medium">Narzędzie w fazie testów:</strong> Wyniki mogą zawierać błędy (false positive/negative). 
                Traktuj rezultaty jako wskazówkę, nie ostateczny wyrok.
              </div>
            </div>
          </div>

          {/* Feature hint */}
          <div className="mb-6 p-4 bg-purple-500/10 border border-purple-400/20 rounded-xl">
            <p className="text-sm text-purple-200">
              💡 <strong className="text-purple-100">Wskazówka:</strong> Wklej 2-5 starych postów tej osoby sprzed 2023 - 
              sprawdzimy czy styl się zmienił!
            </p>
          </div>

          {/* Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-light text-purple-200 mb-3">
              Wklej tekst do analizy (min. 50 znaków)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Wpisz lub wklej tekst tutaj..."
              className="w-full h-64 px-5 py-4 bg-black/30 border border-white/20 rounded-2xl 
                       text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 
                       focus:ring-2 focus:ring-purple-400/20 transition-all resize-none text-sm"
            />
            <div className="mt-2 text-xs text-purple-300">
              {text.length} / 5000 znaków
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={analyzeText}
              disabled={isAnalyzing || text.length < 50}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 
                       text-black font-medium rounded-full hover:from-orange-400 hover:to-orange-500 
                       transition-all disabled:opacity-50 disabled:cursor-not-allowed 
                       shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Analizuję...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Analizuj tekst
                </span>
              )}
            </button>
            
            <button
              onClick={() => {
                setText('');
                setResult(null);
                setError('');
              }}
              className="px-8 py-4 bg-white/5 border border-white/20 text-white font-medium 
                       rounded-full hover:bg-white/10 transition-all"
            >
              Wyczyść
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Main Score */}
              <div className="p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-400/30 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-light">Wynik analizy</h3>
                  <TrendingUp className="w-5 h-5 text-purple-300" />
                </div>
                
                <div className="flex items-end gap-3 mb-4">
                  <span className={`text-6xl font-light ${getConfidenceColor()}`}>
                    {getAIPercentage()}%
                  </span>
                  <span className="text-purple-200 text-sm mb-3">prawdopodobieństwo AI</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-1000"
                    style={{ width: `${getAIPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-black/20 border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-light text-purple-200 mb-2">Perplexity Analysis</h4>
                  <div className="text-2xl font-light mb-1">
                    {Math.round(result.perplexity.score * 100)}%
                  </div>
                  <div className="text-xs text-purple-300">
                    Perplexity: {result.perplexity.perplexity.toFixed(2)}
                  </div>
                </div>

                <div className="p-5 bg-black/20 border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-light text-purple-200 mb-2">Binoculars (Cross-Perplexity)</h4>
                  <div className="text-2xl font-light mb-1">
                    {Math.round(result.binoculars.score * 100)}%
                  </div>
                  <div className="text-xs text-purple-300">
                    Ratio: {result.binoculars.ratio.toFixed(3)}
                  </div>
                </div>
              </div>

              {/* Interpretation */}
              <div className="p-5 bg-blue-500/5 border border-blue-400/20 rounded-2xl">
                <h4 className="text-sm font-light text-blue-200 mb-2">Interpretacja</h4>
                <p className="text-sm text-blue-100 leading-relaxed">
                  {getAIPercentage() >= 70 && (
                    "Tekst wykazuje silne cechy treści generowanej przez AI - wysoka przewidywalność i spójność charakterystyczna dla modeli językowych."
                  )}
                  {getAIPercentage() >= 40 && getAIPercentage() < 70 && (
                    "Tekst może być częściowo wspomagany przez AI lub napisany przez człowieka w bardzo strukturalny sposób."
                  )}
                  {getAIPercentage() < 40 && (
                    "Tekst prawdopodobnie napisany przez człowieka - naturalna zmienność i nieprzewidywalność stylu."
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-purple-300 text-xs">
        <p>Powered by ML • Perplexity + Binoculars Analysis</p>
      </footer>
    </div>
  );
}
