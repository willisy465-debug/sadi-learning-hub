"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, UploadCloud, Plus, Image as ImageIcon, FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  
  // File uploads state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  const handleFileUpload = async (file: File, type: 'image' | 'pdf') => {
    if (type === 'image') setUploadingImage(true);
    if (type === 'pdf') setUploadingPdf(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        if (type === 'image') setImageUrl(data.url);
        if (type === 'pdf') setPdfUrl(data.url);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      if (type === 'image') setUploadingImage(false);
      if (type === 'pdf') setUploadingPdf(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          icon,
          imageUrl,
          pdfUrl,
          displayOrder: categories.length + 1
        }),
      });

      if (res.ok) {
        // Reset form
        setName('');
        setSlug('');
        setDescription('');
        setImageUrl('');
        setPdfUrl('');
        setImageFile(null);
        setPdfFile(null);
        fetchCategories(); // Refresh list
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center space-x-4">
        <Link href="/admin/dashboard" className="p-2.5 rounded border border-udemy-grayBorder bg-white text-slate-500 hover:text-udemy-black hover:border-udemy-purple/30 shadow-sm transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-udemy-black">Course Categories</h1>
          <p className="text-xs text-slate-500 font-medium">Manage course categories, pictorials, and PDF brochures.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Categories */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl border border-udemy-grayBorder bg-white shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-udemy-black border-b border-udemy-grayBorder pb-3">Existing Categories</h2>
            
            {loading ? (
              <div className="flex items-center justify-center p-8 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span className="text-sm font-medium">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center p-8 text-slate-500 text-sm">No categories found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 border border-udemy-grayBorder rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow bg-slate-50/50">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        {cat.imageUrl ? (
                          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-slate-200">
                            <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-udemy-black text-sm">{cat.name}</h3>
                          <p className="text-[10px] text-slate-500 font-mono">/{cat.slug}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-2">{cat.description || 'No description provided.'}</p>
                    </div>
                    
                    {cat.pdfUrl && (
                      <div className="mt-4 pt-3 border-t border-udemy-grayBorder">
                        <a href={cat.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center text-xs text-udemy-purple font-medium hover:underline">
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          View Brochure PDF
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Add New Category Form */}
        <div className="space-y-6">
          <form onSubmit={handleCreateCategory} className="p-6 rounded-xl border border-udemy-grayBorder bg-white shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-udemy-black border-b border-udemy-grayBorder pb-3">Add New Category</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-udemy-black mb-1">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="w-full border border-udemy-grayBorder p-2.5 rounded text-sm text-udemy-black focus:outline-none focus:border-udemy-purple"
                  placeholder="e.g., Artificial Intelligence"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-udemy-black mb-1">URL Slug <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border border-udemy-grayBorder p-2.5 rounded text-sm text-udemy-black font-mono focus:outline-none focus:border-udemy-purple bg-slate-50"
                  placeholder="artificial-intelligence"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-udemy-black mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-udemy-grayBorder p-2.5 rounded text-sm text-udemy-black focus:outline-none focus:border-udemy-purple resize-none"
                  placeholder="Brief description of this category..."
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2 pt-2 border-t border-udemy-grayBorder">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-udemy-black">Pictorial Image</label>
                  <button type="button" className="flex items-center text-[10px] text-udemy-purple font-bold bg-udemy-purple/10 px-2 py-1 rounded hover:bg-udemy-purple/20 transition-colors">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Generate
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'image');
                      }
                    }}
                    className="hidden" 
                    id="image-upload" 
                  />
                  <label 
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-udemy-grayBorder rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                    ) : imageUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded overflow-hidden bg-slate-200 mb-1">
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] text-green-600 font-bold">Image Uploaded ✓</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500">
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
                        <span className="text-xs font-medium">Click to upload image</span>
                        <span className="text-[10px] text-slate-400">JPG, PNG, WebP</span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex items-start mt-1 space-x-1.5 text-[10px] text-slate-500">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <p>For AI generation, future integration will use Gemini/OpenAI to automatically create befitting pictures.</p>
                </div>
              </div>

              {/* PDF Upload */}
              <div className="space-y-2 pt-2 border-t border-udemy-grayBorder">
                <label className="block text-xs font-bold text-udemy-black">Brochure / Documentation (PDF)</label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], 'pdf');
                      }
                    }}
                    className="hidden" 
                    id="pdf-upload" 
                  />
                  <label 
                    htmlFor="pdf-upload"
                    className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-udemy-grayBorder rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    {uploadingPdf ? (
                      <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                    ) : pdfUrl ? (
                      <div className="flex flex-col items-center">
                        <FileText className="w-5 h-5 text-udemy-purple mb-1" />
                        <span className="text-[10px] text-green-600 font-bold">PDF Uploaded ✓</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500">
                        <UploadCloud className="w-5 h-5 mb-1 text-slate-400" />
                        <span className="text-xs font-medium">Click to upload PDF</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || !slug || uploadingImage || uploadingPdf}
              className="w-full flex items-center justify-center p-3 rounded font-bold text-sm text-white bg-udemy-black hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Category
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
