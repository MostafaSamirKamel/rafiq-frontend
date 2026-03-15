const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1' || 'https://rafiq-backend-production.up.railway.app/api/v1';

interface ApiOptions {
  method?: string;
  body?: unknown;
  token?: string;
  isFormData?: boolean;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, token, isFormData = false } = options;

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (err: any) {
    if (err.message.includes('fetch failed') || err.name === 'TypeError') {
      throw new Error('الخادم غير متصل. يرجى التأكد من تشغيل الـ Backend.');
    }
    throw err;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'حدث خطأ غير متوقع' }));
    throw new Error(error.message || 'حدث خطأ في الاتصال');
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  login: (phone: string, password: string) =>
    apiRequest<{ _id: string; phone: string; role: string; fullName: string; token: string }>('/auth/login', {
      method: 'POST',
      body: { phone, password },
    }),

  register: (data: { phone: string; password: string; role: string; fullName: string }) =>
    apiRequest<{ _id: string; phone: string; role: string; fullName: string; token: string }>('/auth/register', {
      method: 'POST',
      body: data,
    }),
  getMe: (token: string) =>
    apiRequest<{ _id: string; phone: string; role: string; fullName: string }>('/auth/me', { token }),
};

// Child APIs
export const childAPI = {
  create: (formData: FormData, token: string) =>
    apiRequest('/children', { method: 'POST', body: formData, token, isFormData: true }),

  getMyChildren: (token: string) =>
    apiRequest('/children', { token }),

  getById: (id: string, token: string) =>
    apiRequest(`/children/${id}`, { token }),

  update: (id: string, data: any, token: string, isFormData: boolean = false) =>
    apiRequest(`/children/${id}`, { 
      method: 'PUT', 
      body: data, 
      token, 
      isFormData 
    }),
};

// Phase 1 - Recognition APIs
export const phase1API = {
  addItem: (formData: FormData, token: string) =>
    apiRequest('/phase1/items', { method: 'POST', body: formData, token, isFormData: true }),

  getItems: (childId: string, token: string) =>
    apiRequest(`/phase1/items/${childId}`, { token }),

  startSession: (data: { childId: string; phase: number }, token: string) =>
    apiRequest('/phase1/start-session', { method: 'POST', body: data, token }),

  submitQuiz: (data: { sessionId: string; itemId: string; correct: boolean }, token: string) =>
    apiRequest('/phase1/quiz', { method: 'POST', body: data, token }),
};

// Phase 2 - Interaction APIs
export const phase2API = {
  generateVideo: (data: { childId: string; type: string }, token: string) =>
    apiRequest('/phase2/generate-video', { method: 'POST', body: data, token }),

  getVideoStatus: (jobId: string, token: string) =>
    apiRequest(`/phase2/video-status/${jobId}`, { token }),
};

// Phase 3 - Communication APIs
export const phase3API = {
  evaluateSpeech: (data: { childId: string; transcript: string; expectedAnswer: string }, token: string) =>
    apiRequest('/phase3/evaluate-response', { method: 'POST', body: data, token }),

  aiChat: (data: { childId: string; message: string }, token: string) =>
    apiRequest('/phase3/ai-chat', { method: 'POST', body: data, token }),
};

// Progress APIs
export const progressAPI = {
  getOverview: (childId: string, token: string) =>
    apiRequest(`/progress/${childId}/overview`, { token }),

  exportReport: (childId: string, token: string) =>
    apiRequest(`/progress/${childId}/export`, { token }),
};
