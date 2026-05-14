'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeftRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  History,
  Circle,
  Languages,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react';
import { Category, Language, Phrase, phrasesData } from '@/data/phrases';

type TranslationDirection = 'ko-to-foreign' | 'foreign-to-ko';
type ActiveTab = 'practice' | 'translate' | 'history';

interface HistoryEntry extends Phrase {
  language: Language;
  learnedAt: string;
  lastTranscript: string;
}

const historyStorageKey = 'language-practice-history-v1';

const getPhraseKey = (language: Language, phrase: Phrase) => `${language}:${phrase.id}`;

export default function PracticeApp() {
  const practiceScopeRef = useRef('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');
  const [language, setLanguage] = useState<Language>('english');
  const [category, setCategory] = useState<Category>('daily');
  const [level, setLevel] = useState(1);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isTranslatingSpeech, setIsTranslatingSpeech] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [completedPhrases, setCompletedPhrases] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [translationDirection, setTranslationDirection] = useState<TranslationDirection>('ko-to-foreign');
  const [translationInput, setTranslationInput] = useState('');
  const [translationOutput, setTranslationOutput] = useState('');
  const [translationPronunciation, setTranslationPronunciation] = useState('');
  const [translationNote, setTranslationNote] = useState('');
  const [translationSpeechStatus, setTranslationSpeechStatus] = useState('');

  const langMap: Record<Language, string> = {
    chinese: 'zh-CN',
    japanese: 'ja-JP',
    english: 'en-US',
    spanish: 'es-ES',
  };

  const languageLabels: Record<Language, string> = {
    english: '영어',
    spanish: '스페인어',
    chinese: '중국어',
    japanese: '일본어',
  };

  const categoryLabels: Record<Category, string> = {
    daily: '일상',
    travel: '여행',
    business: '비즈니스',
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed', error);
      });
    });
  }, []);

  useEffect(() => {
    try {
      const storedHistory = window.localStorage.getItem(historyStorageKey);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load practice history', error);
    }
  }, []);

  useEffect(() => {
    const scopeKey = `${language}:${category}:${level}`;
    const scopeChanged = practiceScopeRef.current !== scopeKey;
    practiceScopeRef.current = scopeKey;
    const learnedKeys = new Set(history.map((entry) => getPhraseKey(entry.language, entry)));
    const filtered = phrasesData[language].filter(
      (phrase) =>
        phrase.category === category &&
        phrase.level === level &&
        (!learnedKeys.has(getPhraseKey(language, phrase)) || completedPhrases.has(phrase.id))
    );
    setPhrases(filtered);
    setCurrentPhraseIndex((currentIndex) => {
      if (scopeChanged) {
        return 0;
      }

      return Math.min(currentIndex, Math.max(filtered.length - 1, 0));
    });

    if (scopeChanged) {
      setTranscript('');
      setCompletedPhrases(new Set());
    }
  }, [language, category, level, history]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.lang = langMap[language];

      recognitionInstance.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        checkAccuracy(speechResult);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [language]);

  useEffect(() => {
    setTranslationOutput('');
    setTranslationPronunciation('');
    setTranslationNote('');
    setTranslationSpeechStatus('');
  }, [language]);

  const normalizeText = (text: string) =>
    text
      .trim()
      .toLowerCase()
      .replace(/[.,!?¿？。！、]/g, '')
      .replace(/\s+/g, ' ');

  const saveHistoryEntry = (phrase: Phrase, spokenText: string) => {
    setHistory((currentHistory) => {
      const phraseKey = getPhraseKey(language, phrase);
      const nextEntry: HistoryEntry = {
        ...phrase,
        language,
        learnedAt: new Date().toISOString(),
        lastTranscript: spokenText,
      };
      const nextHistory = [
        nextEntry,
        ...currentHistory.filter((entry) => getPhraseKey(entry.language, entry) !== phraseKey),
      ];

      try {
        window.localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
      } catch (error) {
        console.error('Failed to save practice history', error);
      }

      return nextHistory;
    });
  };

  const getTranslationMatch = (input: string) => {
    const normalizedInput = normalizeText(input);

    if (!normalizedInput) {
      return null;
    }

    const match = phrasesData[language].find((phrase) => {
      const sourceText =
        translationDirection === 'ko-to-foreign' ? phrase.translation : phrase.text;
      const normalizedSource = normalizeText(sourceText);

      return (
        normalizedSource === normalizedInput ||
        normalizedSource.includes(normalizedInput) ||
        normalizedInput.includes(normalizedSource)
      );
    });

    return match ?? null;
  };

  const translateText = (input = translationInput) => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setTranslationOutput('');
      setTranslationPronunciation('');
      setTranslationNote('번역할 문장을 입력하거나 마이크로 말해보세요.');
      setTranslationSpeechStatus('');
      return;
    }

    const match = getTranslationMatch(trimmedInput);

    if (!match) {
      setTranslationOutput('');
      setTranslationPronunciation('');
      setTranslationNote(
        '아직 내장 번역 사전에 없는 문장입니다. 오늘의 연습 문장에 있는 표현부터 번역할 수 있어요.'
      );
      return;
    }

    if (translationDirection === 'ko-to-foreign') {
      setTranslationOutput(match.text);
      setTranslationPronunciation(match.pronunciation);
    } else {
      setTranslationOutput(match.translation);
      setTranslationPronunciation('');
    }

    setTranslationNote('연습 문장 사전에서 번역했어요.');
  };

  const updateTranslationInput = (value: string) => {
    setTranslationInput(value);
    setTranslationSpeechStatus('');
  };

  const startTranslationListening = () => {
    if (!recognition) {
      setTranslationNote('이 브라우저에서는 음성 인식을 지원하지 않습니다.');
      setTranslationSpeechStatus('');
      return;
    }

    setTranslationOutput('');
    setTranslationPronunciation('');
    setTranslationNote('');
    setTranslationSpeechStatus('듣고 있어요...');
    recognition.lang = translationDirection === 'ko-to-foreign' ? 'ko-KR' : langMap[language];
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranslationInput(speechResult);
      setTranslationSpeechStatus('음성 입력을 번역했어요.');
      translateText(speechResult);
    };
    recognition.onerror = (event: any) => {
      setIsTranslatingSpeech(false);
      setTranslationSpeechStatus('');
      console.error('Translation speech recognition error', event.error);
      setTranslationNote('음성을 인식하지 못했습니다. 다시 시도해보세요.');
    };
    recognition.onend = () => {
      setIsTranslatingSpeech(false);
    };
    recognition.start();
    setIsTranslatingSpeech(true);
  };

  const stopTranslationListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsTranslatingSpeech(false);
    setTranslationSpeechStatus('음성 입력을 중지했어요.');
  };

  const checkAccuracy = (spokenText: string) => {
    const currentPhrase = phrases[currentPhraseIndex];
    if (!currentPhrase) {
      return;
    }

    const normalizedSpoken = spokenText.toLowerCase().replace(/\s+/g, '');
    const normalizedTarget = currentPhrase.text.toLowerCase().replace(/\s+/g, '');

    if (normalizedSpoken.includes(normalizedTarget) || normalizedTarget.includes(normalizedSpoken)) {
      setCompletedPhrases(prev => new Set(prev).add(currentPhrase.id));
      saveHistoryEntry(currentPhrase, spokenText);
    }
  };

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      recognition.lang = langMap[language];
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        checkAccuracy(speechResult);
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const playAudio = (text: string, speechLanguage = langMap[language]) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguage;
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const swapTranslationDirection = () => {
    setTranslationDirection((current) =>
      current === 'ko-to-foreign' ? 'foreign-to-ko' : 'ko-to-foreign'
    );
    setTranslationInput(translationOutput || translationInput);
    setTranslationOutput('');
    setTranslationPronunciation('');
    setTranslationNote('');
    setTranslationSpeechStatus('');
  };

  const currentPhrase = phrases[currentPhraseIndex];
  const progress = phrases.length > 0 ? (completedPhrases.size / phrases.length) * 100 : 0;
  const sourceLabel = translationDirection === 'ko-to-foreign' ? '한국어' : languageLabels[language];
  const targetLabel = translationDirection === 'ko-to-foreign' ? languageLabels[language] : '한국어';
  const outputSpeechLanguage = translationDirection === 'ko-to-foreign' ? langMap[language] : 'ko-KR';
  const scopedHistory = history.filter((entry) => entry.language === language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold text-gray-800">매일 언어 연습</h1>
            <div className="flex items-center gap-1 text-indigo-600">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{new Date().toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Main Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-3 rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'practice'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 active:bg-gray-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              연습
            </button>
            <button
              onClick={() => setActiveTab('translate')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'translate'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 active:bg-gray-200'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              번역
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-gray-500 active:bg-gray-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              기록
            </button>
          </div>

          {/* Language Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setLanguage('english')}
              className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                language === 'english'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              🇺🇸 영어
            </button>
            <button
              onClick={() => setLanguage('spanish')}
              className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                language === 'spanish'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              🇪🇸 스페인어
            </button>
            <button
              onClick={() => setLanguage('chinese')}
              className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                language === 'chinese'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              🇨🇳 중국어
            </button>
            <button
              onClick={() => setLanguage('japanese')}
              className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all ${
                language === 'japanese'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              🇯🇵 일본어
            </button>
          </div>

          {activeTab === 'practice' && (
            <>
              {/* Category Selection */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1.5">카테고리</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setCategory('daily')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      category === 'daily'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                    }`}
                  >
                    일상
                  </button>
                  <button
                    onClick={() => setCategory('travel')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      category === 'travel'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                    }`}
                  >
                    여행
                  </button>
                  <button
                    onClick={() => setCategory('business')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      category === 'business'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                    }`}
                  >
                    비즈니스
                  </button>
                </div>
              </div>

              {/* Level Selection */}
              <div className="mb-3">
                <p className="text-xs text-gray-600 mb-1.5">난이도 레벨: {level}</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={level}
                    onChange={(e) => setLevel(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="text-xs font-medium text-gray-700 w-6 text-center">{level}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                  <span>오늘의 진행률</span>
                  <span className="font-medium">{completedPhrases.size}/{phrases.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {activeTab === 'practice' && (
          <>
            {/* Main Practice Area */}
            {currentPhrase ? (
              <div className="bg-white rounded-xl shadow-lg p-4 mb-3">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-600 text-xs font-medium mb-3">
                    문장 {currentPhraseIndex + 1} / {phrases.length}
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <h2 className="text-2xl font-bold text-gray-800">{currentPhrase.text}</h2>
                      <button
                        onClick={() => playAudio(currentPhrase.text)}
                        className="p-1.5 bg-indigo-100 active:bg-indigo-200 rounded-full transition-colors"
                      >
                        <Volume2 className="w-4 h-4 text-indigo-600" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-0.5">{currentPhrase.pronunciation}</p>
                    <p className="text-xs text-gray-600">{currentPhrase.translation}</p>
                  </div>
                </div>

                {/* Microphone Button */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`p-5 rounded-full transition-all transform active:scale-95 ${
                      isListening
                        ? 'bg-red-500 active:bg-red-600 scale-105 animate-pulse'
                        : 'bg-indigo-600 active:bg-indigo-700'
                    } shadow-lg`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </button>
                  <p className="text-xs text-gray-600 font-medium">
                    {isListening ? '듣고 있어요... 말씀해주세요' : '마이크를 눌러 말해보세요'}
                  </p>
                </div>

                {/* Transcript Result */}
                {transcript && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 mb-1">인식된 내용:</p>
                    <p className="text-base font-medium text-gray-800">{transcript}</p>
                    {completedPhrases.has(currentPhrase.id) && (
                      <div className="flex items-center gap-1.5 mt-2 text-green-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">훌륭해요! 정확합니다!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPhraseIndex(Math.max(0, currentPhraseIndex - 1))}
                    disabled={currentPhraseIndex === 0}
                    className="flex-1 py-2.5 px-3 bg-gray-100 active:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    이전
                  </button>
                  <button
                    onClick={() => setCurrentPhraseIndex(Math.min(phrases.length - 1, currentPhraseIndex + 1))}
                    disabled={currentPhraseIndex === phrases.length - 1}
                    className="flex-1 py-2.5 px-3 bg-indigo-600 active:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-lg transition-colors"
                  >
                    다음
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-3 text-center">
                <p className="text-sm text-gray-600 mb-2">이 조건의 새 문장은 모두 학습했어요.</p>
                <p className="text-xs text-gray-500">기록 탭에서 지난 문장을 복습하거나 다른 레벨을 선택해보세요.</p>
              </div>
            )}

            {/* Phrase List */}
            {phrases.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 pb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-2.5">오늘의 연습 문장</h3>
                <div className="grid grid-cols-1 gap-2">
                  {phrases.map((phrase, index) => (
                    <button
                      key={phrase.id}
                      onClick={() => setCurrentPhraseIndex(index)}
                      className={`p-2.5 rounded-lg text-left transition-all ${
                        currentPhraseIndex === index
                          ? 'bg-indigo-50 border-2 border-indigo-500'
                          : 'bg-gray-50 border-2 border-transparent active:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {completedPhrases.has(phrase.id) ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800">{phrase.text}</p>
                          <p className="text-xs text-gray-500">{phrase.translation}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-4 pb-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 rounded-lg">
                  <History className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">복습 기록</h3>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                {scopedHistory.length}개
              </span>
            </div>

            {scopedHistory.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {scopedHistory.map((entry) => (
                  <div
                    key={`${entry.language}-${entry.id}`}
                    className="rounded-lg border border-gray-100 bg-gray-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            레벨 {entry.level}
                          </span>
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {categoryLabels[entry.category]}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(entry.learnedAt).toLocaleDateString('ko-KR', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="break-words text-sm font-semibold text-gray-800">{entry.text}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{entry.pronunciation}</p>
                        <p className="mt-1 text-xs text-gray-600">{entry.translation}</p>
                        {entry.lastTranscript && (
                          <p className="mt-2 rounded-md bg-white px-2 py-1 text-xs text-gray-500">
                            마지막 발화: {entry.lastTranscript}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => playAudio(entry.text, langMap[entry.language])}
                        className="p-1.5 bg-white active:bg-gray-100 rounded-full transition-colors shadow-sm"
                        aria-label="복습 문장 듣기"
                        title="복습 문장 듣기"
                      >
                        <Volume2 className="w-4 h-4 text-amber-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 p-5 text-center">
                <p className="text-sm text-gray-600 mb-1">아직 복습할 문장이 없습니다.</p>
                <p className="text-xs text-gray-500">연습에서 문장을 정확히 말하면 여기에 기록돼요.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'translate' && (
          /* Translator */
          <div className="bg-white rounded-xl shadow-lg p-4 pb-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-teal-50 rounded-lg">
                  <Languages className="w-4 h-4 text-teal-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">번역 연습</h3>
              </div>
              <button
                onClick={swapTranslationDirection}
                className="p-2 bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
                aria-label="번역 방향 바꾸기"
                title="번역 방향 바꾸기"
              >
                <ArrowLeftRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-3 text-xs font-medium">
              <div className="rounded-lg bg-teal-50 px-2.5 py-2 text-center text-teal-700">
                {sourceLabel}
              </div>
              <ArrowLeftRight className="w-3.5 h-3.5 text-gray-400" />
              <div className="rounded-lg bg-indigo-50 px-2.5 py-2 text-center text-indigo-700">
                {targetLabel}
              </div>
            </div>

            <div className="mb-3">
              <textarea
                value={translationInput}
                onChange={(event) => updateTranslationInput(event.target.value)}
                placeholder={`${sourceLabel} 문장을 입력하세요`}
                rows={5}
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-[1fr_1fr] gap-2 mb-3">
              <button
                onClick={() => translateText()}
                className="flex-1 py-2.5 px-3 bg-teal-600 active:bg-teal-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                번역하기
              </button>
              <button
                onClick={isTranslatingSpeech ? stopTranslationListening : startTranslationListening}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium transition-colors ${
                  isTranslatingSpeech
                    ? 'bg-red-500 active:bg-red-600 text-white'
                    : 'bg-gray-100 active:bg-gray-200 text-gray-700'
                }`}
                aria-label="번역 음성 입력"
                title="번역 음성 입력"
              >
                {isTranslatingSpeech ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    중지
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    음성 입력
                  </>
                )}
              </button>
            </div>

            {translationSpeechStatus && (
              <div className="mb-3 rounded-lg bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700">
                {translationSpeechStatus}
              </div>
            )}

            {(translationOutput || translationNote) && (
              <div className="rounded-lg bg-gradient-to-r from-teal-50 to-indigo-50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600 mb-1">번역 결과</p>
                    <p className="break-words text-base font-semibold text-gray-800">
                      {translationOutput || '번역 결과가 없습니다.'}
                    </p>
                    {translationPronunciation && (
                      <p className="mt-1 text-xs text-gray-500">{translationPronunciation}</p>
                    )}
                  </div>
                  {translationOutput && (
                    <button
                      onClick={() => playAudio(translationOutput, outputSpeechLanguage)}
                      className="p-1.5 bg-white active:bg-gray-100 rounded-full transition-colors shadow-sm"
                      aria-label="번역 결과 듣기"
                      title="번역 결과 듣기"
                    >
                      <Volume2 className="w-4 h-4 text-teal-600" />
                    </button>
                  )}
                </div>
                {translationNote && (
                  <p className="mt-2 text-xs text-gray-500">{translationNote}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
