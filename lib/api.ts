import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSignLanguages = async (category?: string) => {
  const url = category ? `/api/sign-languages/?category=${category}` : '/api/sign-languages/';
  const response = await api.get(url);
  return response.data;
};

export const getSignLanguageById = async (id: string) => {
  const response = await api.get(`/api/sign-languages/${id}`);
  return response.data;
};

export const createSignLanguage = async (data: any) => {
  const response = await api.post('/api/sign-languages/', data);
  return response.data;
};

export const updateSignLanguage = async (id: string, data: any) => {
  const response = await api.put(`/api/sign-languages/${id}`, data);
  return response.data;
};

export const deleteSignLanguage = async (id: string) => {
  const response = await api.delete(`/api/sign-languages/${id}`);
  return response.data;
};

export const uploadPicture = async (label: string, file: File) => {
  const formData = new FormData();
  formData.append('label', label);
  formData.append('file', file);
  
  const response = await api.post('/api/sign-languages/uploadpicture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadVideo = async (label: string, file: File) => {
  const formData = new FormData();
  formData.append('label', label);
  formData.append('file', file);
  
  const response = await api.post('/api/sign-languages/uploadvideo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;