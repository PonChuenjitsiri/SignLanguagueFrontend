"use client";

import { useState, useEffect } from 'react';
import { getSignLanguages, createSignLanguage, deleteSignLanguage } from '../lib/api';
import { SignLanguage } from '../lib/types';
import Link from 'next/link';
import InstallButton from '@/components/InstallButton';

export default function Dashboard() {
  const [signs, setSigns] = useState<SignLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New sign form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTitleThai, setNewTitleThai] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const fetchSigns = async () => {
    try {
      setLoading(true);
      const data = await getSignLanguages();
      setSigns(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch sign languages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSignLanguage({
        label: newLabel,
        titleThai: newTitleThai,
        category: newCategory
      });
      setShowAddForm(false);
      setNewLabel('');
      setNewTitleThai('');
      setNewCategory('');
      fetchSigns();
    } catch (err) {
      console.error(err);
      alert('Failed to create sign language entry.');
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm('Are you sure you want to delete this entry?')) return;
    try {
      await deleteSignLanguage(id);
      fetchSigns();
    } catch (err) {
      console.error(err);
      alert('Failed to delete.');
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Header Section - Responsive Flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Sign Language Admin</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <InstallButton /> {/* <-- 2. วางปุ่มติดตั้งแอป */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
          >
            {showAddForm ? 'Cancel' : '+ Add New Sign'}
          </button>
        </div>

      </div>

      {showAddForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Add New Sign Language Entry</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label (English)</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded p-2 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. hello"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (Thai)</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded p-2 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                  value={newTitleThai}
                  onChange={(e) => setNewTitleThai(e.target.value)}
                  placeholder="e.g. สวัสดี"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  className="w-full border border-gray-300 rounded p-2 text-sm sm:text-base focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Greeting"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition">
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-sm sm:text-base">{error}</div>}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
          {/* Table Wrapper with Horizontal Scroll for Mobile */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Thai Title</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Media</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {signs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm sm:text-base">No sign languages found</td></tr>
                ) : (
                  signs.map((sign) => (
                    <tr key={sign._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900">{sign.label}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">{sign.titleThai}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">
                        {sign.category && <span className="px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">{sign.category}</span>}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-1 sm:gap-2">
                          {sign.imageUrl ? (
                            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm sm:text-lg shadow-sm" title="Image available">🖼️</span>
                          ) : (
                            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 opacity-60 text-sm sm:text-lg" title="No image">🖼️</span>
                          )}
                          {sign.videoUrl ? (
                            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm sm:text-lg shadow-sm" title="Video available">🎥</span>
                          ) : (
                            <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 opacity-60 text-sm sm:text-lg" title="No video">🎥</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex justify-end items-center gap-3 sm:gap-4">
                          <Link
                            href={`/edit/${sign._id}`}
                            className="text-blue-600 hover:text-blue-900 font-semibold"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(sign._id)}
                            className="text-red-600 hover:text-red-900 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}