'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, PlusCircle, Calendar, Award, Edit, Trash2, ArrowLeft, Upload, Video, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('BLENDED');
  const [durationDays, setDurationDays] = useState('5');
  const [cpdPoints, setCpdPoints] = useState('10');
  const [priceZar, setPriceZar] = useState('15000');
  const [priceUsd, setPriceUsd] = useState('950');
  const [videoUrl, setVideoUrl] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/enrolments'); // or catalogue fetch
      const data = await res.json();
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          title,
          shortDescription,
          deliveryMethod,
          durationDays,
          cpdPoints,
          priceZar,
          priceUsd,
          videoUrl,
          moduleTitle,
          lessonTitle,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload course');
      }

      setMessage('Course & video lecture material successfully uploaded!');
      setShowModal(false);
      // Reset form
      setCode('');
      setTitle('');
      setShortDescription('');
      setVideoUrl('');
      fetchCourses();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/dashboard" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/30">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-white">Super Admin Course & Video Manager</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[10px]">
                RESTRICTED TO SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400">Upload new training curricula, streaming lecture videos, and set tuition pricing.</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="gold-button px-5 py-3 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Course & Video Material</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-2 ${
          message.startsWith('Error')
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Upload Course & Video Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel max-w-2xl w-full p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Upload Course & Video Lecture</h3>
                  <p className="text-xs text-slate-400">Add course metadata, pricing, and video streaming links.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                    placeholder="SADI-FIN-2026"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Delivery Method</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="BLENDED">Blended (Pretoria + Online)</option>
                    <option value="SELF_PACED">Online Self-Paced Video</option>
                    <option value="FACE_TO_FACE">Pretoria Face-to-Face Workshop</option>
                    <option value="IN_HOUSE_CORPORATE">In-House Corporate Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Advanced Public Sector Financial Governance"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-amber-400 focus:outline-none"
                  placeholder="Master strategic PFM reform, internal audit control, and IPSAS compliance."
                />
              </div>

              {/* Pricing & Duration */}
              <div className="grid grid-cols-4 gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">CPD Points</label>
                  <input
                    type="number"
                    value={cpdPoints}
                    onChange={(e) => setCpdPoints(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Fee (ZAR)</label>
                  <input
                    type="number"
                    value={priceZar}
                    onChange={(e) => setPriceZar(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Fee (USD)</label>
                  <input
                    type="number"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-emerald-400"
                  />
                </div>
              </div>

              {/* Video Streaming Material Link */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <Video className="w-4 h-4" />
                  <span>Video Lecture Material Upload & Streaming Link</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Video Stream URL (MP4 / HLS / YouTube / Vimeo Embed)</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-amber-400 focus:outline-none"
                    placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Initial Module Title</label>
                    <input
                      type="text"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      placeholder="Module 1: IPSAS Framework"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Initial Lesson Title</label>
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      placeholder="Lesson 1.1: Financial Governance Overview"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="gold-button px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{submitting ? 'Uploading Material...' : 'Publish Course & Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course List Table */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center">
          <BookOpen className="w-5 h-5 text-amber-400 mr-2" />
          <span>Active Course & Video Catalogue ({courses.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Code</th>
                <th className="p-3">Course Title</th>
                <th className="p-3">Delivery Mode</th>
                <th className="p-3">Duration</th>
                <th className="p-3">CPD</th>
                <th className="p-3">Tuition Fee (ZAR/USD)</th>
                <th className="p-3">Video Material</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-amber-400">{course.code}</td>
                  <td className="p-3 font-bold text-white max-w-xs truncate">{course.title}</td>
                  <td className="p-3 font-medium text-slate-300">{course.deliveryMethod ? course.deliveryMethod.replace(/_/g, ' ') : 'BLENDED'}</td>
                  <td className="p-3 text-slate-400">{course.durationDays} Days</td>
                  <td className="p-3 font-mono text-amber-400 font-bold">{course.cpdPoints} Pts</td>
                  <td className="p-3 font-mono text-emerald-400 font-semibold">
                    ZAR {course.priceZar?.toLocaleString()} / USD {course.priceUsd}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] flex items-center w-max">
                      <Video className="w-3 h-3 mr-1" />
                      Uploaded
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700 font-semibold text-[11px]"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
