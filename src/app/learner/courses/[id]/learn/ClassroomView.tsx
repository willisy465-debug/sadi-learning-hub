'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  PlayCircle, CheckCircle, Volume2, FileText, Download, Shield, Wifi, WifiOff, 
  ArrowLeft, ArrowRight, Award, Video, Sparkles, BookOpen, Lock, MessageSquare, Edit3, 
  Settings, Check, Send, Trash2, Maximize2 
} from 'lucide-react';

interface ClassroomViewProps {
  course: any;
  userId: string;
  userEmail: string;
  userName: string;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({ course, userId, userEmail, userName }) => {
  const allLessons = course.modules?.flatMap((m: any) => m.lessons) || [];
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'notes' | 'resources'>('overview');
  
  // Interactive Q&A State
  const [qaList, setQaList] = useState<Array<{ id: string; user: string; text: string; date: string }>>([
    {
      id: 'qa-1',
      user: 'Dr. Joseph Ndlovu',
      text: 'What are the main financial disclosures required under IPSAS 1 relative to public sector entities?',
      date: '2 hours ago',
    },
    {
      id: 'qa-2',
      user: 'SADI Faculty Expert',
      text: 'IPSAS 1 mandates presentation of Statement of Financial Position, Financial Performance, and Cash Flow Statement with accrual basis adjustments.',
      date: '1 hour ago',
    },
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Interactive Personal Notes State
  const [notesList, setNotesList] = useState<Array<{ id: string; timestamp: string; text: string }>>([
    { id: 'note-1', timestamp: '03:45', text: 'Important: Accrual accounting requires revenue recognition when earned, not received.' },
  ]);
  const [newNote, setNewNote] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    allLessons.forEach((l: any) => {
      if (l.progresses && l.progresses.length > 0 && l.progresses[0].isCompleted) {
        initial[l.id] = true;
      }
    });
    return initial;
  });

  const activeLesson = allLessons[currentLessonIndex] || allLessons[0] || {
    id: 'demo-lesson',
    title: 'Lesson 1.1: Executive Online Orientation & Overview',
    durationMinutes: 15,
    summary: 'Orientation to online hosted materials and capacity development platform.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    textContent: 'Welcome to the SADI Executive Online Classroom. Review video material, download study notes, and complete your final assessment upon conclusion.',
  };

  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleComplete = async (lessonId: string) => {
    const nextState = !completedLessons[lessonId];
    setCompletedLessons({ ...completedLessons, [lessonId]: nextState });

    try {
      await fetch('/api/learner/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, isCompleted: nextState }),
      });
    } catch (e) {
      console.warn('Progress save fallback:', e);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQaList([
      ...qaList,
      {
        id: `qa-${Date.now()}`,
        user: userName || 'Delegate',
        text: newQuestion,
        date: 'Just now',
      },
    ]);
    setNewQuestion('');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const currentTime = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
    const mins = Math.floor(currentTime / 60);
    const secs = currentTime % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    setNotesList([
      ...notesList,
      {
        id: `note-${Date.now()}`,
        timestamp: timeStr,
        text: newNote,
      },
    ]);
    setNewNote('');
  };

  const handleDownloadMaterials = (lessonTitle: string) => {
    const content = `SADI EXECUTIVE LEARNING HUB — ONLINE STUDY MATERIAL\n\nCourse: ${course.code} - ${course.title}\nLesson: ${lessonTitle}\nDelegate: ${userName} (${userEmail})\n\nOfficial Course Materials & Digital Notes:\n\n1. Executive Summary & Regulatory Framework\n2. Case Studies & Pan-African Implementation Protocols\n3. Self-Assessment Review Questions\n\n(c) 2026 Southern Africa Development Institute. All Rights Reserved.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SADI_${course.code}_${lessonTitle.replace(/[^a-zA-Z0-9]/g, '_')}_StudyPack.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      
      {/* Udemy Classroom Top Bar */}
      <div className="glass-nav px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/learner/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">{course.code}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">UDEMY PLAYER</span>
            </div>
            <h1 className="text-sm font-bold text-white truncate max-w-md">{course.title}</h1>
          </div>
        </div>

        {/* Udemy Progress Bar Indicator */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-3 text-xs">
            <div className="w-32 bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-slate-300 font-mono font-bold">{progressPercent}%</span>
            <span className="text-slate-500 text-[11px]">({completedCount}/{allLessons.length || 1} complete)</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2 border transition-colors ${
                lowBandwidthMode
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {lowBandwidthMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{lowBandwidthMode ? 'Audio Mode' : 'HD Video'}</span>
            </button>

            {course.examinations && course.examinations.length > 0 && (
              <Link
                href={`/learner/exams/${course.examinations[0].id}`}
                className="gold-button px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Award className="w-3.5 h-3.5 text-slate-950" />
                <span>CPD Exam</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Udemy Player & Classroom Sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        
        {/* Main Content & Video Player Area */}
        <div className="lg:col-span-3 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)]">
          
          {/* Udemy Media Player Container */}
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl flex flex-col justify-between group">
            
            {/* Dynamic Security Watermark */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none text-[10px] font-mono text-slate-400/50 select-none bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800">
              SADI Udemy Player • {userEmail} • {userName}
            </div>

            {lowBandwidthMode ? (
              <div className="flex-1 p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
                <Volume2 className="w-16 h-16 text-amber-400 animate-pulse" />
                <h3 className="text-lg font-bold text-white">Audio Stream Fallback Active</h3>
                <p className="text-xs text-slate-400">
                  Consuming minimal internet data. Listen to the executive lecture audio stream while reviewing lesson notes below.
                </p>
                <audio controls className="w-full mt-4">
                  <source src={activeLesson?.videoUrl || ''} type="audio/mp3" />
                  Your browser does not support audio playback.
                </audio>
              </div>
            ) : (
              <video
                ref={videoRef}
                key={activeLesson?.id}
                controls
                controlsList="nodownload"
                poster={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                className="w-full h-full object-contain"
              >
                <source src={activeLesson?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
            )}

            {/* Udemy Custom Speed Controller Overlay Bar */}
            <div className="bg-slate-950/90 backdrop-blur-md px-6 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center space-x-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Speed:</span>
                {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] transition-colors ${
                      playbackSpeed === s
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>HD 1080p Stream</span>
              </div>
            </div>
          </div>

          {/* Lesson Header & Mark Complete Action */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Active Video Lecture</span>
              <h2 className="text-xl font-bold text-white">{activeLesson?.title}</h2>
              <p className="text-xs text-slate-400">{activeLesson?.summary}</p>
            </div>

            <button
              onClick={() => handleToggleComplete(activeLesson.id)}
              className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                completedLessons[activeLesson?.id]
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'gold-button shadow-lg shadow-amber-500/10'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{completedLessons[activeLesson?.id] ? 'Lesson Completed ✓' : 'Mark Lesson Complete'}</span>
            </button>
          </div>

          {/* Udemy Multi-Tab Navigation */}
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            
            {/* Tab Navigation Headers */}
            <div className="flex items-center border-b border-slate-800 bg-slate-900/60 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 text-xs font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'overview'
                    ? 'border-amber-400 text-amber-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('qa')}
                className={`px-6 py-4 text-xs font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'qa'
                    ? 'border-amber-400 text-amber-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Q&A Discussion ({qaList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-6 py-4 text-xs font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'notes'
                    ? 'border-amber-400 text-amber-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>Notes ({notesList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`px-6 py-4 text-xs font-bold flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all ${
                  activeTab === 'resources'
                    ? 'border-amber-400 text-amber-400 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Downloads</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <h4 className="font-bold text-white text-base">About this lesson</h4>
                  <p>
                    {activeLesson?.textContent || `This executive online video lecture covers fundamental concepts for ${course.title}.`}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <span className="font-bold text-amber-400 uppercase tracking-wider block mb-1">Instructor</span>
                      <p className="text-white font-semibold">SADI Executive Panel & Pan-African Experts</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-1">CPD Credits</span>
                      <p className="text-white font-semibold">{course.cpdPoints || 20} Accredited CPD Points</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Q&A Discussion Tab */}
              {activeTab === 'qa' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddQuestion} className="space-y-3">
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ask a question about this lesson or regulatory concept..."
                      className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                      rows={3}
                    />
                    <button
                      type="submit"
                      className="gold-button px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Question</span>
                    </button>
                  </form>

                  <div className="space-y-3 border-t border-slate-800 pt-4">
                    {qaList.map((qa) => (
                      <div key={qa.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-400">{qa.user}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{qa.date}</span>
                        </div>
                        <p className="text-xs text-slate-300">{qa.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddNote} className="space-y-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Type a personal study note... (will tag current video time)"
                      className="w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                      rows={3}
                    />
                    <button
                      type="submit"
                      className="gold-button px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Save Study Note</span>
                    </button>
                  </form>

                  <div className="space-y-3 border-t border-slate-800 pt-4">
                    {notesList.map((n) => (
                      <div key={n.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between text-xs">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold border border-amber-500/20">
                            Timestamp {n.timestamp}
                          </span>
                          <p className="text-slate-300 pt-1">{n.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Downloads Tab */}
              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-sm">Available Downloads for {activeLesson?.title}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-bold text-white">Lesson Study Pack (PDF)</p>
                        <p className="text-[10px] text-slate-400">Includes executive slides & case study notes</p>
                      </div>
                      <button
                        onClick={() => handleDownloadMaterials(activeLesson?.title)}
                        className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Sidebar: Course Module Syllabus Navigation */}
        <div className="lg:col-span-1 border-l border-slate-800/80 bg-slate-900/60 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div className="space-y-1 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Course Syllabus</h3>
            <p className="text-[11px] text-slate-400">{allLessons.length || 1} Total Lessons</p>
          </div>

          <div className="space-y-4">
            {(course.modules || []).map((mod: any, mIdx: number) => (
              <div key={mod.id || mIdx} className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Module {mIdx + 1}: {mod.title}
                </h4>
                <div className="space-y-1">
                  {(mod.lessons || []).map((lesson: any) => {
                    const lIndex = allLessons.findIndex((al: any) => al.id === lesson.id);
                    const isActive = currentLessonIndex === lIndex;
                    const isDone = completedLessons[lesson.id];

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(lIndex >= 0 ? lIndex : 0)}
                        className={`w-full text-left p-3 rounded-xl text-xs transition-colors flex items-center justify-between ${
                          isActive
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                            : 'bg-slate-950/40 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {isDone ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Video className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                          {lesson.durationMinutes || 15}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
