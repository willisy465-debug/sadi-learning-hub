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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Exam Header Bar */}
      <div className="bg-white px-6 py-4 border-b border-udemy-grayBorder flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-udemy-purple/10 text-udemy-purple font-mono font-bold flex items-center justify-center border border-udemy-purple/20">
            {exam.code}
          </div>
          <div>
            <h1 className="text-sm font-bold text-udemy-black truncate max-w-md">{exam.title}</h1>
            <p className="text-[10px] text-slate-500 font-medium">Candidate: {userName} ({userEmail})</p>
          </div>
        </div>

        {/* Timer & Connectivity Indicator */}
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border ${
            isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Auto-Syncing Answers' : 'Offline (Saved Locally)'}</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white border border-udemy-grayBorder text-udemy-black font-mono font-bold text-sm flex items-center space-x-2 shadow-sm">
            <Clock className="w-4 h-4 animate-pulse text-udemy-purple" />
            <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8">
        
        {submittedResult ? (
          /* Result Summary & Certificate Access */
          <div className="bg-white p-10 rounded-xl border border-udemy-grayBorder text-center space-y-6 shadow-sm">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              submittedResult.isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}>
              {submittedResult.isPassed ? <Award className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-udemy-black">
                {submittedResult.isPassed ? 'Congratulations! Examination Passed' : 'Examination Attempt Complete'}
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                Final Score: <span className="font-bold text-udemy-purple font-mono text-xl">{submittedResult.scorePercent}%</span> (Required Pass Mark: {exam.passMarkPercent}%)
              </p>
            </div>

            {submittedResult.isPassed && (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 max-w-md mx-auto space-y-4">
                <p className="text-xs font-medium">Your official SADI Verifiable Certificate of Achievement has been generated and signed!</p>
                <button
                  onClick={() => router.push('/learner/certificates')}
                  className="w-full udemy-button-primary py-3 rounded font-bold text-xs flex items-center justify-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>View & Download My Certificate</span>
                </button>
              </div>
            )}

            <div>
              <button
                onClick={() => router.push('/learner/dashboard')}
                className="px-6 py-2.5 rounded bg-white border border-udemy-grayBorder text-slate-600 font-bold text-xs hover:text-udemy-black hover:bg-slate-50 transition-colors"
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
                    className={`w-9 h-9 rounded-full font-mono text-xs font-bold transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'bg-udemy-purple text-white shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-white text-slate-500 border border-udemy-grayBorder'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question Card */}
            {currentQuestion && (
              <div className="bg-white p-8 rounded-xl border border-udemy-grayBorder space-y-6 shadow-sm">
                
                <div className="flex items-center justify-between border-b border-udemy-grayBorder pb-4">
                  <span className="text-xs font-bold text-udemy-purple uppercase tracking-wider font-mono">
                    Question {activeQuestionIndex + 1} of {exam.questions.length} • {currentQuestion.points} Points
                  </span>
                  <span className="text-xs text-slate-500 font-bold uppercase">{currentQuestion.questionType.replace(/_/g, ' ')}</span>
                </div>

                <h3 className="text-lg font-bold text-udemy-black leading-relaxed">
                  {currentQuestion.questionText}
                </h3>

                {/* Multiple Choice / True-False Options */}
                {(currentQuestion.questionType === 'MULTIPLE_CHOICE' || currentQuestion.questionType === 'TRUE_FALSE') && (
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options.map((opt: any) => {
                      const isSelected = answers[currentQuestion.id]?.selectedOptionId === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                          className={`w-full text-left p-4 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-udemy-purple/5 text-udemy-purple border-2 border-udemy-purple shadow-sm'
                              : 'bg-white text-slate-700 border border-udemy-grayBorder hover:border-udemy-purple/30 hover:bg-slate-50'
                          }`}
                        >
                          <span>{opt.optionText}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-udemy-purple shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Essay Response Textarea */}
                {currentQuestion.questionType === 'ESSAY' && (
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs text-slate-500 font-bold">Type your detailed answer response below:</label>
                    <textarea
                      rows={6}
                      value={answers[currentQuestion.id]?.essayAnswer || ''}
                      onChange={(e) => handleEssayChange(currentQuestion.id, e.target.value)}
                      placeholder="Type your response here..."
                      className="w-full p-4 rounded-xl bg-white border border-udemy-grayBorder text-udemy-black text-xs focus:border-udemy-purple focus:outline-none focus:ring-1 focus:ring-udemy-purple/20"
                    />
                  </div>
                )}

                {/* Question Navigation Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-udemy-grayBorder">
                  <button
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    className="px-4 py-2.5 rounded bg-white border border-udemy-grayBorder text-slate-500 text-xs font-bold disabled:opacity-30 flex items-center space-x-1 hover:bg-slate-50 hover:text-udemy-black transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Question</span>
                  </button>

                  {activeQuestionIndex < exam.questions.length - 1 ? (
                    <button
                      onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                      className="px-5 py-2.5 rounded bg-white hover:bg-slate-50 text-udemy-purple text-xs font-bold flex items-center space-x-1 border border-udemy-grayBorder hover:border-udemy-purple/30 transition-colors"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitExam}
                      disabled={isSubmitting}
                      className="udemy-button-primary px-6 py-2.5 rounded text-xs font-bold flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
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
