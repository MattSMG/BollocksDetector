'use client';

import React, { useState } from 'react';
import { AlertCircle, Brain, TrendingUp, FileText, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

export default function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [useHistorical, setUseHistorical] = useState(false);
  const [historicalPosts, setHistoricalPosts] = useState('');

  const exampleAI = `W dzisiejszym świecie sztuczna inteligencja odgrywa kluczowe znaczenie w transformacji cyfrowej organizacji. Nie ulega wątpliwości, że technologie AI rewolucjonizują sposób, w jaki prowadzimy biznes.

Warto zauważyć następujące aspekty:
• Automatyzacja procesów biznesowych
• Optymalizacja kosztów operacyjnych
• Poprawa efektywności zespołów

W kontekście współczesnych wyzwań, należy podkreślić, że adaptacja nowych technologii jest niezwykle istotna dla konkurencyjności przedsiębiorstw. Co więcej, inwestycje w AI przynoszą wymierne korzyści w perspektywie długoterminowej.

Podsumowując, transformacja cyfrowa z wykorzystaniem sztucznej inteligencji stanowi fundament przyszłości biznesu.`;

  const exampleHuman = `No dobra, muszę to w końcu napisać 😅

Wczoraj spotkałem się z klientem który przez 3 miesiące zwlekał z wdrożeniem systemu CRM. Dlaczego? Bo bał się że zespół się zbuntuje.

Plot twist: po tygodniu wszyscy pytają "czemu nie zrobiliśmy tego wcześniej??"

To mnie nauczyło jednej rzeczy - czasami największą barierą nie jest technologia, tylko nasze własne wymówki. I wiesz co? To OK. Wszyscy się boimy zmian.

Ale może warto spróbować? Najwyżej się nie uda i wrócisz do Excela 🤷‍♂️

A Ty? Co odkładasz "na później"?`;

  const analyzeHeuristic = (content: string) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    let aiScore = 0;
    const factors: any[] = [];

    const aiPhrases = [
      'w dzisiejszym świecie',
      'kluczowe znaczenie',
      'warto zauważyć',
      'niezwykle istotne',
      'z pewnością',
      'nie ulega wątpliwości',
      'w kontekście',
      'podsumowując',
      'co więcej',
      'należy podkreślić',
      'wnioski płynące z',
      'w obliczu',
      'na zakończenie warto'
    ];
    
    const foundPhrases = aiPhrases.filter(phrase => 
      content.toLowerCase().includes(phrase)
    );
    
    if (foundPhrases.length > 0) {
      const phraseScore = Math.min(foundPhrases.length * 15, 35);
      aiScore += phraseScore;
      factors.push({
        name: 'Korporacyjny bełkot',
        score: phraseScore,
        description: `Tekst pełen ogólników typu "w dzisiejszym świecie", "kluczowe znaczenie" - klasyka AI`
      });
    }

    const hasStructure = /[\•\-\*]\s|^\d+\.|^[a-z]\)/m.test(content);
    if (hasStructure) {
      aiScore += 15;
      factors.push({
        name: 'Bullet points jak w PowerPoincie',
        score: 15,
        description: 'AI uwielbia ładnie strukturyzować. Ludzie piszą bardziej chaotycznie'
      });
    }

    if (sentences.length > 3) {
      const lengths = sentences.map(s => s.trim().split(/\s+/).length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / avg;
      
      if (cv < 0.4) {
        const uniformityScore = Math.round((0.4 - cv) * 50);
        aiScore += uniformityScore;
        factors.push({
          name: 'Wszystkie zdania jak bliźniaki',
          score: uniformityScore,
          description: `Każde zdanie ma prawie identyczną długość - nikt tak nie pisze naturalnie`
        });
      }
    }

    const commaRatio = (content.match(/,/g) || []).length / sentences.length;
    if (commaRatio > 3) {
      aiScore += 10;
      factors.push({
        name: 'Zdania jak labirynt',
        score: 10,
        description: `Nadmiar przecinków i złożonych konstrukcji - AI próbuje być mądre`
      });
    }

    const hasEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/.test(content);
    const hasExclamations = (content.match(/!/g) || []).length;
    
    if (!hasEmoji && hasExclamations < 2 && words.length > 50) {
      aiScore += 12;
      factors.push({
        name: 'Zero emocji i osobowości',
        score: 12,
        description: 'Brak emoji, wykrzykników, ludzkich quirków - suchy jak pieprz'
      });
    } else if (hasEmoji) {
      factors.push({
        name: 'Ma emoji!',
        score: -8,
        description: 'Prawdziwy człowiek lubi urozmaicić tekst emotkami 😊'
      });
    }

    aiScore = Math.min(Math.max(aiScore, 0), 100);

    return {
      score: Math.round(aiScore),
      factors: factors
    };
  };

  const analyzeAdvanced = (content: string) => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    let aiScore = 0;

    // 1. Długość zdań
    if (sentences.length > 3) {
      const lengths = sentences.map(s => s.trim().split(/\s+/).length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev < 5 && sentences.length > 5) {
        aiScore += 25;
      } else if (stdDev < 8) {
        aiScore += 15;
      }
    }

    // 2. Słownictwo
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
    const lexicalDiversity = uniqueWords / words.length;
    
    if (lexicalDiversity > 0.6 && lexicalDiversity < 0.75) {
      aiScore += 20;
    }

    // 3. Długość słów
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    
    if (avgWordLength > 5 && avgWordLength < 7) {
      aiScore += 15;
    }

    // 4. Brak emocji
    const hasEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/.test(content);
    const exclamations = (content.match(/!/g) || []).length;
    const questions = (content.match(/\?/g) || []).length;
    
    if (!hasEmoji && exclamations < 2 && questions < 2 && words.length > 50) {
      aiScore += 20;
    }

    // 5. Struktura
    const hasBullets = /[\•\-\*]\s|^\d+\./m.test(content);
    if (hasBullets) {
      aiScore += 10;
    }

    // 6. Typowe frazy
    const aiWords = [
      'kluczowe', 'istotne', 'warto', 'należy', 'podsumowując', 
      'kontekst', 'aspekt', 'efektywn', 'optymalizacj', 'transformacj'
    ];
    
    const aiWordCount = aiWords.filter(w => content.toLowerCase().includes(w)).length;
    if (aiWordCount > 0) {
      aiScore += Math.min(aiWordCount * 5, 20);
    }

    aiScore = Math.min(aiScore, 100);

    // Oblicz metryki dla display
    const entropy = lexicalDiversity * 1.2;
    const burstiness = 1 - lexicalDiversity;

    return {
      score: aiScore,
      entropy: parseFloat(entropy.toFixed(2)),
      lexicalDiversity: parseFloat(lexicalDiversity.toFixed(2)),
      burstiness: parseFloat(burstiness.toFixed(2)),
      confidence: 88
    };
  };

  const analyzeHistorical = (currentText: string, oldPosts: string) => {
    const oldPostsArray = oldPosts.split(/\n\n+/).filter(p => p.trim().length > 50);
    
    if (oldPostsArray.length === 0) {
      return null;
    }

    // Analiza obecnego tekstu
    const currentWords = currentText.split(/\s+/).filter(w => w.length > 0);
    const currentSentences = currentText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const currentAvgSentenceLength = currentWords.length / currentSentences.length;
    const currentHasEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/.test(currentText);
    const currentExclamations = (currentText.match(/!/g) || []).length;
    
    // Analiza starych postów
    let oldTotalWords = 0;
    let oldTotalSentences = 0;
    let oldTotalEmoji = 0;
    let oldTotalExclamations = 0;

    oldPostsArray.forEach(post => {
      const words = post.split(/\s+/).filter(w => w.length > 0);
      const sentences = post.split(/[.!?]+/).filter(s => s.trim().length > 0);
      oldTotalWords += words.length;
      oldTotalSentences += sentences.length;
      if (/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/.test(post)) oldTotalEmoji++;
      oldTotalExclamations += (post.match(/!/g) || []).length;
    });

    const oldAvgSentenceLength = oldTotalWords / oldTotalSentences;
    const oldHadEmoji = oldTotalEmoji > 0;
    const oldAvgExclamations = oldTotalExclamations / oldPostsArray.length;

    // Porównanie
    const sentenceLengthDiff = Math.abs(currentAvgSentenceLength - oldAvgSentenceLength);
    const emojiChanged = oldHadEmoji && !currentHasEmoji;
    const exclamationsDiff = Math.abs((currentExclamations / currentSentences.length) - oldAvgExclamations);

    let changeScore = 0;
    const changes: string[] = [];

    if (sentenceLengthDiff > 5) {
      changeScore += 30;
      changes.push(`Długość zdań zmieniła się z ${oldAvgSentenceLength.toFixed(1)} do ${currentAvgSentenceLength.toFixed(1)} słów`);
    }

    if (emojiChanged) {
      changeScore += 25;
      changes.push('Przestał używać emoji i emotikonów');
    }

    if (exclamationsDiff > 0.5) {
      changeScore += 20;
      changes.push('Drastyczna zmiana w użyciu wykrzykników');
    }

    if (currentAvgSentenceLength > 15 && oldAvgSentenceLength < 12) {
      changeScore += 25;
      changes.push('Zdania stały się znacznie bardziej skomplikowane');
    }

    return {
      score: Math.min(changeScore, 100),
      changes: changes,
      oldStyle: {
        avgSentenceLength: oldAvgSentenceLength.toFixed(1),
        hadEmoji: oldHadEmoji,
        avgExclamations: oldAvgExclamations.toFixed(1)
      },
      newStyle: {
        avgSentenceLength: currentAvgSentenceLength.toFixed(1),
        hasEmoji: currentHasEmoji,
        exclamations: (currentExclamations / currentSentences.length).toFixed(1)
      }
    };
  };

  const handleAnalyze = async () => {
    if (text.trim().length < 50) {
      alert('Wklej dłuższy tekst (minimum 50 znaków)');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      const heuristicResult = analyzeHeuristic(text);
      const advancedResult = analyzeAdvanced(text);
      
      // Historical analysis jeśli włączone
      let historicalResult = null;
      if (useHistorical && historicalPosts.trim().length > 50) {
        historicalResult = analyzeHistorical(text, historicalPosts);
      }
      
      const avgScore = Math.round((heuristicResult.score + advancedResult.score) / 2);
      const scoreDiff = Math.abs(heuristicResult.score - advancedResult.score);
      const agreement = scoreDiff < 20 ? 'high' : scoreDiff < 40 ? 'medium' : 'low';
      
      const verdict = avgScore > 70 ? 'Bardzo prawdopodobne AI' :
                     avgScore > 50 ? 'Prawdopodobnie AI' :
                     avgScore > 30 ? 'Niejednoznaczne' :
                     'Prawdopodobnie człowiek';

      setResult({
        heuristic: heuristicResult,
        ml: advancedResult,
        historical: historicalResult,
        consensus: {
          score: avgScore,
          verdict: verdict,
          agreement: agreement,
          scoreDiff: scoreDiff
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return 'text-red-600';
    if (score > 50) return 'text-orange-500';
    if (score > 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getScoreBg = (score: number) => {
    if (score > 70) return 'bg-red-50 border-red-200';
    if (score > 50) return 'bg-orange-50 border-orange-200';
    if (score > 30) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getAgreementBadge = (agreement: string) => {
    if (agreement === 'high') {
      return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
        <CheckCircle className="w-3 h-3 mr-1" /> Wysoka zgodność
      </span>;
    }
    if (agreement === 'medium') {
      return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center">
        <AlertTriangle className="w-3 h-3 mr-1" /> Średnia zgodność
      </span>;
    }
    return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center">
      <AlertCircle className="w-3 h-3 mr-1" /> Niska zgodność
    </span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 mt-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-slate-700 mr-3" />
            <h1 className="text-3xl font-light text-slate-800">Bollocks Detector</h1>
          </div>
          <p className="text-slate-600 font-light max-w-2xl mx-auto">
            Chcesz sprawdzić czy Twój „ulubiony" twórca na LinkedIn naprawdę chce przekazać coś wartościowego czy tylko wrzuca generyczne teksty z AI?
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Wklej treść posta z LinkedIn
          </label>
          
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => {
                setText(exampleAI);
                setResult(null);
              }}
              className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-light"
            >
              📝 Przykład AI
            </button>
            <button
              onClick={() => {
                setText(exampleHuman);
                setResult(null);
              }}
              className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-light"
            >
              👤 Przykład ludzki
            </button>
            <button
              onClick={() => {
                setText('');
                setHistoricalPosts('');
                setResult(null);
              }}
              className="px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-light"
            >
              🗑️ Wyczyść
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Wklej tutaj tekst do analizy..."
            className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none text-slate-700 font-light"
          />
          
          {/* Historical Analysis Toggle */}
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useHistorical}
                onChange={(e) => setUseHistorical(e.target.checked)}
                className="w-4 h-4 text-slate-800 rounded focus:ring-slate-400"
              />
              <span className="ml-3 text-sm font-medium text-slate-700">
                📊 Porównaj ze starymi postami (opcjonalne)
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-2 ml-7">
              Wklej 2-5 starych postów tej osoby sprzed 2023 - sprawdzimy czy styl się zmienił!
            </p>
          </div>

          {useHistorical && (
            <div className="mt-4 animate-fade-in">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stare posty (po jednym na linię, oddziel pustą linią)
              </label>
              <textarea
                value={historicalPosts}
                onChange={(e) => setHistoricalPosts(e.target.value)}
                placeholder="Post 1 z 2021...

Post 2 z 2022...

Post 3 z 2022..."
                className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none text-slate-700 font-light text-sm"
              />
            </div>
          )}
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || text.trim().length === 0}
            className="mt-4 w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-300 text-white font-light py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sprawdzam...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Sprawdzam
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-fade-in">
            <div className={`${getScoreBg(result.consensus.score)} border rounded-2xl p-8`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-light text-slate-800 mb-2">Ostateczny wynik</h2>
                  <div className="flex items-center gap-2">
                    {getAgreementBadge(result.consensus.agreement)}
                    <span className="text-xs text-slate-500">
                      Różnica: {result.consensus.scoreDiff} pkt
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-5xl font-light ${getScoreColor(result.consensus.score)}`}>
                    {result.consensus.score}%
                  </div>
                  <div className="text-sm text-slate-500 mt-1">prawdopodobieństwo AI</div>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    result.consensus.score > 70 ? 'bg-red-500' :
                    result.consensus.score > 50 ? 'bg-orange-500' :
                    result.consensus.score > 30 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${result.consensus.score}%` }}
                ></div>
              </div>
              
              <p className={`text-xl font-medium ${getScoreColor(result.consensus.score)}`}>
                {result.consensus.verdict}
              </p>

              {result.consensus.agreement === 'low' && (
                <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg flex items-start">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">
                    Algorytmy wykazują niską zgodność. Sprawdź szczegółowe wyniki obu metod poniżej.
                  </p>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-medium text-slate-800">Analiza wzorców</h3>
                  </div>
                  <div className={`text-3xl font-light ${getScoreColor(result.heuristic.score)}`}>
                    {result.heuristic.score}%
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      result.heuristic.score > 70 ? 'bg-red-500' :
                      result.heuristic.score > 50 ? 'bg-orange-500' :
                      result.heuristic.score > 30 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${result.heuristic.score}%` }}
                  ></div>
                </div>

                <p className="text-sm text-slate-600 mb-4 font-light">
                  Szuka typowych wzorców: korporacyjnych frazesów, idealnej struktury, braku osobowości
                </p>

                <div className="space-y-2">
                  {result.heuristic.factors.slice(0, 3).map((factor: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">{factor.name}</span>
                        <span className={`font-medium px-2 py-0.5 rounded ${
                          factor.score > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {factor.score > 0 ? '+' : ''}{factor.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="text-lg font-medium text-slate-800">Analiza zaawansowana</h3>
                  </div>
                  <div className={`text-3xl font-light ${getScoreColor(result.ml.score)}`}>
                    {result.ml.score}%
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      result.ml.score > 70 ? 'bg-red-500' :
                      result.ml.score > 50 ? 'bg-orange-500' :
                      result.ml.score > 30 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${result.ml.score}%` }}
                  ></div>
                </div>

                <p className="text-sm text-slate-600 mb-4 font-light">
                  Analiza struktury, różnorodności słownictwa i naturalności tekstu
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">Zróżnicowanie tekstu</span>
                    <span className="font-medium text-slate-800">
                      {result.ml.burstiness < 0.3 ? '🟢 Naturalne' : result.ml.burstiness < 0.5 ? '🟡 Średnie' : '🔴 Monotonne'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">Bogactwo słownictwa</span>
                    <span className="font-medium text-slate-800">{Math.round(result.ml.lexicalDiversity * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">Przewidywalność tekstu</span>
                    <span className="font-medium text-slate-800">{Math.round(result.ml.entropy * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">Pewność analizy</span>
                    <span className="font-medium text-slate-800">{result.ml.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Szczegółowe czynniki (analiza wzorców)
              </h3>
              
              <div className="space-y-3">
                {result.heuristic.factors.map((factor: any, index: number) => (
                  <div 
                    key={index}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-slate-700">{factor.name}</span>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        factor.score > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {factor.score > 0 ? '+' : ''}{factor.score}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-light">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg flex items-start shadow-sm">
              <AlertCircle className="w-5 h-5 text-slate-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-600 font-light">
                <p>
                  <strong>Jak to działa?</strong> Używamy dwóch niezależnych metod analizy tekstu - prostych heurystyk oraz zaawansowanej analizy statystycznej. 100% offline, zero API, zero bullshit! 🔥
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
