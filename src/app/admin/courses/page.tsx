'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, PlusCircle, Calendar, Award, Edit, Trash2, ArrowLeft, Upload, Video, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

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
  const [meetingPlatform, setMeetingPlatform] = useState('ZOOM');
  const [meetingUrl, setMeetingUrl] = useState('');

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
          meetingPlatform,
          meetingUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload course');
      }

      setMessage('Course & video lecture material successfully uploaded!');
      setShowModal(false);
      // Reset form
      setTitle('');
      setShortDescription('');
      setVideoUrl('');
      setMeetingUrl('');
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
          <Link href="/admin/dashboard" className="p-2.5 rounded border border-udemy-grayBorder bg-white text-slate-500 hover:text-udemy-black hover:border-udemy-purple/30 shadow-sm transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-udemy-black">Super Admin Course & Video Manager</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-udemy-purple/10 border border-udemy-purple/20 text-udemy-purple font-bold text-[10px]">
                RESTRICTED TO SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Upload new training curricula, streaming lecture videos, and set tuition pricing.</p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="udemy-button-primary px-5 py-3 rounded text-xs flex items-center space-x-2 shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full p-8 rounded-xl border border-udemy-grayBorder shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-udemy-grayBorder pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-udemy-purple/10 border border-udemy-purple/20 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-udemy-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-udemy-black text-lg">Upload Course & Video Lecture</h3>
                  <p className="text-xs text-slate-500 font-medium">Add course metadata, pricing, and video streaming links.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-udemy-black font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none focus:ring-1 focus:ring-udemy-purple/20"
                    placeholder="SADI-FIN-2026"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Delivery Method</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none focus:ring-1 focus:ring-udemy-purple/20"
                  >
                    <option value="SELF_PACED_VIDEOS">Online Self-Paced Videos</option>
                    <option value="INSTRUCTOR_LED_LIVE">Instructor-Led Live (Zoom/Teams)</option>
                    <option value="VIRTUAL_IN_HOUSE">Virtual In-House Corporate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none focus:ring-1 focus:ring-udemy-purple/20"
                  placeholder="Advanced Public Sector Financial Governance"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none focus:ring-1 focus:ring-udemy-purple/20"
                  placeholder="Master strategic PFM reform, internal audit control, and IPSAS compliance."
                />
              </div>

              {/* Pricing & Duration */}
              <div className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 border border-udemy-grayBorder">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-white border border-udemy-grayBorder text-udemy-black font-mono focus:border-udemy-purple focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">CPD Points</label>
                  <input
                    type="number"
                    value={cpdPoints}
                    onChange={(e) => setCpdPoints(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-white border border-udemy-grayBorder text-udemy-purple font-mono focus:border-udemy-purple focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fee (ZAR)</label>
                  <input
                    type="number"
                    value={priceZar}
                    onChange={(e) => setPriceZar(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-white border border-udemy-grayBorder text-emerald-700 font-mono focus:border-udemy-purple focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Fee (USD)</label>
                  <input
                    type="number"
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-white border border-udemy-grayBorder text-emerald-700 font-mono focus:border-udemy-purple focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Video Streaming Material Link */}
              <div className="p-4 rounded-xl bg-udemy-purple/5 border border-udemy-purple/20 space-y-3">
                <div className="flex items-center space-x-2 text-udemy-purple font-bold">
                  <Video className="w-4 h-4" />
                  <span>Video Lecture Material Upload & Streaming Link</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Video Stream URL (MP4 / HLS / YouTube / Vimeo Embed)</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black font-mono focus:border-udemy-purple focus:outline-none focus:ring-1 focus:ring-udemy-purple/20"
                    placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Initial Module Title</label>
                    <input
                      type="text"
                      value={moduleTitle}
                      onChange={(e) => setModuleTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none"
                      placeholder="Module 1: IPSAS Framework"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Initial Lesson Title</label>
                    <input
                      type="text"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none"
                      placeholder="Lesson 1.1: Financial Governance Overview"
                    />
                  </div>
                </div>
              </div>

              {/* Live Meeting details (if instructor-led or virtual in-house) */}
              {(deliveryMethod === 'INSTRUCTOR_LED_LIVE' || deliveryMethod === 'VIRTUAL_IN_HOUSE') && (
                <div className="p-4 rounded-xl bg-udemy-purple/5 border border-udemy-purple/20 space-y-3">
                  <div className="flex items-center space-x-2 text-udemy-purple font-bold">
                    <Video className="w-4 h-4" />
                    <span>Live Session Setup (Auto-creates initial Cohort)</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="block text-slate-700 font-bold mb-1">Platform</label>
                      <select
                        value={meetingPlatform}
                        onChange={(e) => setMeetingPlatform(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none"
                      >
                        <option value="ZOOM">Zoom</option>
                        <option value="TEAMS">Microsoft Teams</option>
                        <option value="GOOGLE_MEET">Google Meet</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-slate-700 font-bold mb-1">Meeting Invite URL</label>
                      <input
                        type="url"
                        value={meetingUrl}
                        onChange={(e) => setMeetingUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-udemy-grayBorder text-udemy-black focus:border-udemy-purple focus:outline-none"
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded hover:bg-slate-100 text-slate-600 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="udemy-button-primary px-6 py-2.5 rounded font-bold flex items-center space-x-2 shadow-sm"
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
      <div className="p-8 rounded-xl border border-udemy-grayBorder bg-white space-y-6 shadow-sm">
        <h2 className="text-lg font-bold text-udemy-black flex items-center">
          <BookOpen className="w-5 h-5 text-udemy-purple mr-2" />
          <span>Active Course & Video Catalogue ({courses.length})</span>
        </h2>

        <div className="overflow-x-auto rounded-lg border border-udemy-grayBorder">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-udemy-grayBorder">
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
            <tbody className="divide-y divide-udemy-grayBorder">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-udemy-purple">{course.code}</td>
                  <td className="p-3 font-bold text-udemy-black max-w-xs truncate">{course.title}</td>
                  <td className="p-3 font-medium text-slate-600">{course.deliveryMethod ? course.deliveryMethod.replace(/_/g, ' ') : 'SELF PACED VIDEOS'}</td>
                  <td className="p-3 text-slate-500 font-medium">{course.durationDays} Days</td>
                  <td className="p-3 font-mono text-udemy-purple font-bold">{course.cpdPoints} Pts</td>
                  <td className="p-3 font-mono text-emerald-700 font-bold">
                    ZAR {course.priceZar?.toLocaleString()} / USD {course.priceUsd}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] flex items-center w-max">
                      <Video className="w-3 h-3 mr-1" />
                      Uploaded
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="px-3 py-1.5 rounded bg-slate-100 border border-udemy-grayBorder text-slate-700 hover:bg-slate-200 font-bold text-[11px] transition-colors"
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
