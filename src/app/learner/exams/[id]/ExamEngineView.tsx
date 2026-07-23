'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ShieldAlert, CheckCircle, Wifi, WifiOff, Send, Award, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

interface ExamEngineViewProps {
  exam: any;
  attempt: any;
  userId: string;
  userEmail: string;
  userName: string;
}

export const ExamEngineView: React.FC<ExamEngineViewProps> = ({ exam, attempt, userId, userEmail, userName }) => {
  const router = useRouter();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(attempt.timeRemainingSec || exam.timeLimitMinutes * 60);
  const [isOnline, setIsOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  // Answers state keyed by questionId -> { selectedOptionId, essayAnswer }
  const [answers, setAnswers] = useState<Record<string, { selectedOptionId?: string; essayAnswer?: string }>>(() => {
    // Load from local storage if available for offline resilience
    const localKey = `sadi_exam_answers_${attempt.id}`;
    const saved = typeof window !== 'undefined' ? localStorage.getItem(localKey) : null;
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (submittedResult || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, submittedResult]);

  // Persist answers to localStorage on change
  const handleSelectOption = (questionId: string, optionId: string) => {
    const next = { ...answers, [questionId]: { ...answers[questionId], selectedOptionId: optionId } };
    setAnswers(next);
    localStorage.setItem(`sadi_exam_answers_${attempt.id}`, JSON.stringify(next));
  };

  const handleEssayChange = (questionId: string, text: string) => {
    const next = { ...answers, [questionId]: { ...answers[questionId], essayAnswer: text } };
    setAnswers(next);
    localStorage.setItem(`sadi_exam_answers_${attempt.id}`, JSON.stringify(next));
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/learner/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attempt.id,
          examinationId: exam.id,
          answers,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmittedResult(data);
        localStorage.removeItem(`sadi_exam_answers_${attempt.id}`);
      } else {
        alert(data.error || 'Failed to submit examination');
      }
    } catch (err) {
      alert('Network error during exam submission. Your answers are saved locally and will submit upon reconnection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = exam.questions[activeQuestionIndex];
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      
      {/* Exam Header Bar */}
      <div className="glass-nav px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 font-mono font-bold flex items-center justify-center border border-amber-500/30">
            {exam.code}
          </div>
          <div>
            <h1 className="text-sm font-bold text-white truncate max-w-md">{exam.title}</h1>
            <p className="text-[10px] text-slate-400">Candidate: {userName} ({userEmail})</p>
          </div>
        </div>

        {/* Timer & Connectivity Indicator */}
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border ${
            isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Auto-Syncing Answers' : 'Offline (Saved Locally)'}</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-400 font-mono font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/10">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8">
        
        {submittedResult ? (
          /* Result Summary & Certificate Access */
          <div className="glass-panel p-10 rounded-3xl border border-amber-500/30 text-center space-y-6">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              submittedResult.isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {submittedResult.isPassed ? <Award className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">
                {submittedResult.isPassed ? 'Congratulations! Examination Passed' : 'Examination Attempt Complete'}
              </h2>
              <p className="text-sm text-slate-300">
                Final Score: <span className="font-bold text-amber-400 font-mono text-xl">{submittedResult.scorePercent}%</span> (Required Pass Mark: {exam.passMarkPercent}%)
              </p>
            </div>

            {submittedResult.isPassed && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 max-w-md mx-auto space-y-4">
                <p className="text-xs">Your official SADI Verifiable Certificate of Achievement has been generated and signed!</p>
                <button
                  onClick={() => router.push('/learner/certificates')}
                  className="w-full gold-button py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>View & Download My Certificate</span>
                </button>
              </div>
            )}

            <div>
              <button
                onClick={() => router.push('/learner/dashboard')}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:text-white"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Active Examination Interface */
          <div className="space-y-6">
            
            {/* Question Progress Dots */}
            <div className="flex flex-wrap gap-2 justify-center">
              {exam.questions.map((q: any, idx: number) => {
                const isAnswered = Boolean(answers[q.id]?.selectedOptionId || answers[q.id]?.essayAnswer);
                const isCurrent = idx === activeQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question Card */}
            {currentQuestion && (
              <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                    Question {activeQuestionIndex + 1} of {exam.questions.length} • {currentQuestion.points} Points
                  </span>
                  <span className="text-xs text-slate-400 uppercase">{currentQuestion.questionType.replace(/_/g, ' ')}</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-relaxed">
                  {currentQuestion.questionText}
                </h3>

                {/* Multiple Choice Options */}
                {currentQuestion.questionType === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options.map((opt: any) => {
                      const isSelected = answers[currentQuestion.id]?.selectedOptionId === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                          className={`w-full text-left p-4 rounded-2xl text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-500 shadow-md shadow-amber-500/10'
                              : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>{opt.optionText}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Essay Response Textarea */}
                {currentQuestion.questionType === 'ESSAY' && (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs text-slate-400">Type your detailed answer response below:</label>
                    <textarea
                      rows={6}
                      value={answers[currentQuestion.id]?.essayAnswer || ''}
                      onChange={(e) => handleEssayChange(currentQuestion.id, e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                )}

                {/* Question Navigation Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold disabled:opacity-30 flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Question</span>
                  </button>

                  {activeQuestionIndex < exam.questions.length - 1 ? (
                    <button
                      onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center space-x-1 border border-amber-500/30"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      disabled={isSubmitting}
                      className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-amber-500/20"
                    >
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>{isSubmitting ? 'Submitting Examination...' : 'Submit Examination'}</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
