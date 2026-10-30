'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, PlusCircle, ArrowLeft, Upload, Video, CheckCircle2, FileText, Trash2, Loader2 } from 'lucide-react';

type UploadedDoc = { url: string; name: string; contentType: string };

const SELF_PACED_METHODS = new Set([
  'ONLINE_SELF_PACED',
  'SELF_PACED_VIDEOS',
  'SELF_PACED',
  'BLENDED',
]);

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
  const [deliveryMethod, setDeliveryMethod] = useState('ONLINE_SELF_PACED');
  const [durationDays, setDurationDays] = useState('5');
  const [cpdPoints, setCpdPoints] = useState('10');
  const [priceZar, setPriceZar] = useState('15000');
  const [priceUsd, setPriceUsd] = useState('950');
  const [videoUrl, setVideoUrl] = useState('');
  const [moduleTitle, setModuleTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [meetingPlatform, setMeetingPlatform] = useState('ZOOM');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (res.ok && data.courses) {
        setCourses(data.courses);
      } else {
        console.error(data.error || 'Failed to load courses');
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

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploadingDoc(true);
    setMessage('');

    try {
      const uploaded: UploadedDoc[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Failed to upload ${file.name}`);
        uploaded.push({
          url: data.url,
          name: data.name || file.name,
          contentType: data.contentType || 'PDF',
        });
      }
      setDocuments((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUploadingDoc(false);
      e.target.value = '';
    }
  };

  const removeDocument = (url: string) => {
    setDocuments((prev) => prev.filter((d) => d.url !== url));
  };

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
          documents,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload course');
      }

      const docNote = documents.length
        ? ` with ${documents.length} study document${documents.length === 1 ? '' : 's'}`
        : '';
      setMessage(`Course & materials successfully uploaded${docNote}!`);
      setShowModal(false);
      setCode('');
      setTitle('');
      setShortDescription('');
      setVideoUrl('');
      setMeetingUrl('');
      setModuleTitle('');
      setLessonTitle('');
      setDocuments([]);
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
              <h1 className="text-2xl font-black text-udemy-black">Course & Video Manager</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-udemy-purple/10 border border-udemy-purple/20 text-udemy-purple font-bold text-[10px]">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Upload curricula, videos, PDF/Word study packs, and tuition pricing.</p>
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
                  <p className="text-xs text-slate-500 font-medium">Add metadata, video links, and PDF/Word materials for self-paced learning.</p>
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
                    <option value="ONLINE_SELF_PACED">Online Self-Paced Courses</option>
                    <option value="SELF_PACED_VIDEOS">Online Self-Paced Video Lectures</option>
                    <option value="SELF_PACED">Self-Paced E-Learning</option>
                    <option value="INSTRUCTOR_LED_LIVE">Instructor-Led Live (Zoom/Teams)</option>
                    <option value="VIRTUAL_IN_HOUSE">Virtual In-House Corporate</option>
                    <option value="BLENDED">Blended Online & Masterclass</option>
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

              {/* Self-paced PDF / Word study materials */}
              {SELF_PACED_METHODS.has(deliveryMethod) && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                    <FileText className="w-4 h-4" />
                    <span>Self-Paced Study Documents (PDF / Word)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Upload PDF or Word (.doc/.docx) files. Learners will see and download them in the classroom Downloads tab and as syllabus items.
                  </p>
                  <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-emerald-300 bg-white cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors">
                    {uploadingDoc ? (
                      <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-emerald-600" />
                    )}
                    <span className="text-xs font-bold text-emerald-800">
                      {uploadingDoc ? 'Uploading…' : 'Choose PDF or Word files'}
                    </span>
                    <span className="text-[10px] text-slate-500">You can select multiple files</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      multiple
                      disabled={uploadingDoc}
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </label>
                  {documents.length > 0 && (
                    <ul className="space-y-2">
                      {documents.map((doc) => (
                        <li
                          key={doc.url}
                          className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white border border-emerald-200 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{doc.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                              {doc.contentType}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(doc.url)}
                            className="p-1.5 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            aria-label={`Remove ${doc.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

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
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">Loading courses...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">No courses yet. Upload your first course to get started.</td>
                </tr>
              ) : null}
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
