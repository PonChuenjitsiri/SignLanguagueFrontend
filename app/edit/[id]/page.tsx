"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSignLanguageById, updateSignLanguage, uploadPicture, uploadVideo } from '../../../lib/api';
import { SignLanguage } from '../../../lib/types';
import Image from 'next/image';

export default function EditSignLanguage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [sign, setSign] = useState<SignLanguage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [label, setLabel] = useState('');
  const [titleThai, setTitleThai] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (!id) return;

    const fetchSign = async () => {
      try {
        setLoading(true);
        const data = await getSignLanguageById(id);
        setSign(data);
        setLabel(data.label);
        setTitleThai(data.titleThai);
        setCategory(data.category || '');
        setDescription(data.description || '');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch sign language entry.');
      } finally {
        setLoading(false);
      }
    };

    fetchSign();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateSignLanguage(id, {
        label,
        titleThai,
        category,
        description
      });
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Failed to update entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!sign?.label) return;

    try {
      setUploadingImage(true);
      setUploadMessage({ text: 'Uploading image...', type: 'info' });
      
      const result = await uploadPicture(sign.label, file);
      
      // Update local state to show new image
      setSign(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
      setUploadMessage({ text: 'Image uploaded successfully!', type: 'success' });
      
      // Clear input
      e.target.value = '';
    } catch (err) {
      console.error(err);
      setUploadMessage({ text: 'Failed to upload image.', type: 'error' });
    } finally {
      setUploadingImage(false);
      setTimeout(() => setUploadMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!sign?.label) return;

    try {
      setUploadingVideo(true);
      setUploadMessage({ text: 'Uploading video... (this might take a moment)', type: 'info' });
      
      const result = await uploadVideo(sign.label, file);
      
      // Update local state to show new video
      setSign(prev => prev ? { ...prev, videoUrl: result.videoUrl } : null);
      setUploadMessage({ text: 'Video uploaded successfully!', type: 'success' });
      
      // Clear input
      e.target.value = '';
    } catch (err) {
      console.error(err);
      setUploadMessage({ text: 'Failed to upload video.', type: 'error' });
    } finally {
      setUploadingVideo(false);
      setTimeout(() => setUploadMessage({ text: '', type: '' }), 5000);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (error || !sign) {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error || 'Sign not found'}</div>
        <Link href="/" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1">
          <span>←</span> Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden text-gray-800">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Edit Sign Language: {sign.label}</h1>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Form */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Basic Information</h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label (Identifier/English)</label>
                  <input 
                    required 
                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800" 
                    value={label} 
                    onChange={(e) => setLabel(e.target.value)} 
                    disabled // Label is used as key for uploads, better not to change easily
                  />
                  <p className="text-xs text-gray-500 mt-1">Label is used as the unique identifier for files.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thai Title</label>
                  <input 
                    required 
                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800" 
                    value={titleThai} 
                    onChange={(e) => setTitleThai(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input 
                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px] text-gray-800" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded shadow transition"
                  >
                    {saving ? 'Saving...' : 'Update Information'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Media Uploads */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Media Files (MinIO)</h2>
              
              {uploadMessage.text && (
                <div className={`p-3 rounded mb-4 text-sm ${
                  uploadMessage.type === 'error' ? 'bg-red-100 text-red-700' : 
                  uploadMessage.type === 'success' ? 'bg-green-100 text-green-700' : 
                  'bg-blue-100 text-blue-700'
                }`}>
                  {uploadMessage.text}
                </div>
              )}

              <div className="space-y-6">
                {/* Image Upload Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">Image Reference</h3>
                  
                  {sign.imageUrl ? (
                    <div className="mb-4 bg-white p-2 border rounded">
                      <img 
                        src={sign.imageUrl} 
                        alt={sign.titleThai} 
                        className="max-h-48 mx-auto object-contain"
                      />
                      <p className="text-xs text-gray-500 mt-2 break-all">{sign.imageUrl}</p>
                    </div>
                  ) : (
                    <div className="mb-4 bg-gray-100 p-6 border border-dashed border-gray-300 rounded text-center text-gray-500">
                      No image uploaded yet
                    </div>
                  )}
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Video Upload Section */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-800 mb-2">Gesture Video</h3>
                  
                  {sign.videoUrl ? (
                    <div className="mb-4 bg-white p-2 border rounded">
                      <video 
                        src={sign.videoUrl} 
                        controls 
                        className="w-full max-h-48 bg-black rounded"
                      />
                      <p className="text-xs text-gray-500 mt-2 break-all">{sign.videoUrl}</p>
                    </div>
                  ) : (
                    <div className="mb-4 bg-gray-100 p-6 border border-dashed border-gray-300 rounded text-center text-gray-500">
                      No video uploaded yet
                    </div>
                  )}
                  
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="video/mp4, video/webm, video/quicktime, video/x-msvideo" 
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-purple-50 file:text-purple-700
                        hover:file:bg-purple-100
                        cursor-pointer disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}