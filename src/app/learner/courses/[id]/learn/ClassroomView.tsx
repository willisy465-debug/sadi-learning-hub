'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlayCircle, CheckCircle, Volume2, FileText, Download, Shield, Wifi, WifiOff, ArrowLeft, ArrowRight, Award } from 'lucide-react';

interface ClassroomViewProps {
  course: any;
  userId: string;
  userEmail: string;
  userName: string;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({ course, userId, userEmail, userName }) => {
  const allLessons = course.modules.flatMap((m: any) => m.lessons);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    allLessons.forEach((l: any) => {
      if (l.progresses && l.progresses.length > 0 && l.progresses[0].isCompleted) {
        initial[l.id] = true;
      }
    });
    return initial;
  });

  const activeLesson = allLessons[currentLessonIndex] || allLessons[0];

  const handleToggleComplete = async (lessonId: string) => {
    const nextState = !completedLessons[lessonId];
    setCompletedLessons({ ...completedLessons, [lessonId]: nextState });

    await fetch('/api/learner/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, isCompleted: nextState }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      
      {/* Classroom Top Bar */}
      <div className="glass-nav px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/learner/dashboard" className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">{course.code}</span>
            <h1 className="text-sm font-bold text-white truncate max-w-md">{course.title}</h1>
          </div>
        </div>

        {/* Low-Bandwidth Data Saver Toggle */}
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
            <span>{lowBandwidthMode ? 'Audio-Only Data Saver Mode' : 'HD Video Streaming'}</span>
          </button>

          {course.examinations.length > 0 && (
            <Link
              href={`/learner/exams/${course.examinations[0].id}`}
              className="gold-button px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Award className="w-3.5 h-3.5 text-slate-950" />
              <span>Take Final Exam</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Grid: Content Player & Module Sidebar */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        
        {/* Content & Player Area */}
        <div className="lg:col-span-3 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-60px)]">
          
          {/* Media Player Container */}
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl flex items-center justify-center">
            
            {/* Dynamic Watermark to prevent piracy */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none text-[10px] font-mono text-slate-500/40 select-none bg-slate-950/40 px-2 py-1 rounded">
              SADI Security • {userEmail} • {userName}
            </div>

            {lowBandwidthMode ? (
              <div className="p-8 text-center space-y-4 max-w-md">
                <Volume2 className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
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
                key={activeLesson?.id}
                controls
                controlsList="nodownload"
                poster={course.featuredImage}
                className="w-full h-full object-contain"
              >
                <source src={activeLesson?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
            )}
          </div>

          {/* Lesson Header & Mark Complete */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Active Lesson</span>
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

          {/* Transcript & Lecture Notes */}
          {activeLesson?.textContent && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white flex items-center">
                  <FileText className="w-4 h-4 text-amber-400 mr-2" />
                  <span>Lecture Transcript & Reading Material</span>
                </h3>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {activeLesson.textContent}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar: Course Module Syllabus Navigation */}
        <div className="lg:col-span-1 border-l border-slate-800/80 bg-slate-900/60 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div className="space-y-1 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Course Modules</h3>
            <p className="text-[11px] text-slate-400">{allLessons.length} Total Lessons</p>
          </div>

          <div className="space-y-4">
            {course.modules.map((mod: any, mIdx: number) => (
              <div key={mod.id} className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Module {mIdx + 1}: {mod.title}
                </h4>
                <div className="space-y-1">
                  {mod.lessons.map((lesson: any) => {
                    const lIndex = allLessons.findIndex((al: any) => al.id === lesson.id);
                    const isActive = currentLessonIndex === lIndex;
                    const isDone = completedLessons[lesson.id];

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(lIndex)}
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
                            <PlayCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-1">
                          {lesson.durationMinutes}m
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
