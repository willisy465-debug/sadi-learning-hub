'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlayCircle, CheckCircle, Volume2, FileText, Download, Shield, Wifi, WifiOff, ArrowLeft, ArrowRight, Award, Video, Sparkles, BookOpen, Lock } from 'lucide-react';

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

  const handleDownloadMaterials = (lessonTitle: string) => {
    // Generate downloadable study pack text file/PDF
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      
      {/* Classroom Top Bar */}
      <div className="glass-nav px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/learner/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">{course.code}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">100% ONLINE</span>
            </div>
            <h1 className="text-sm font-bold text-white truncate max-w-md">{course.title}</h1>
          </div>
        </div>

        {/* Action Controls */}
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
            <span>{lowBandwidthMode ? 'Audio Data Saver' : 'HD Video Stream'}</span>
          </button>

          {course.examinations && course.examinations.length > 0 && (
            <Link
              href={`/learner/exams/${course.examinations[0].id}`}
              className="gold-button px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1"
            >
              <Award className="w-3.5 h-3.5 text-slate-950" />
              <span>Launch Online CPD Exam</span>
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
            
            {/* Dynamic Security Watermark */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none text-[10px] font-mono text-slate-400/50 select-none bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800">
              SADI Online • {userEmail} • {userName}
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
                poster={course.featuredImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop'}
                className="w-full h-full object-contain"
              >
                <source src={activeLesson?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
                Your browser does not support HTML5 video playback.
              </video>
            )}
          </div>

          {/* Lesson Header & Download Action */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Active Hosted Video Lesson</span>
              <h2 className="text-xl font-bold text-white">{activeLesson?.title}</h2>
              <p className="text-xs text-slate-400">{activeLesson?.summary}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDownloadMaterials(activeLesson?.title || 'Lesson Materials')}
                className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Lesson PDF Pack</span>
              </button>

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
          </div>

          {/* Transcript & Digital Reading Pack */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white flex items-center">
                <FileText className="w-4 h-4 text-amber-400 mr-2" />
                <span>Digital Courseware & Lecture Study Notes</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold">100% Online Resource</span>
            </div>
            
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
              {activeLesson?.textContent || `This hosted online module covers essential executive competencies for ${course.title}.\n\nReview the video lecture above in detail. Use the 'Download Lesson PDF Pack' button to save offline study materials and slide decks.`}
            </div>
          </div>

        </div>

        {/* Sidebar: Course Module Syllabus Navigation */}
        <div className="lg:col-span-1 border-l border-slate-800/80 bg-slate-900/60 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          <div className="space-y-1 pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Online Course Syllabus</h3>
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
