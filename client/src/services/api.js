const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('edupulse_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: (role) => request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  adminCreateStudent: (studentData) => request('/auth/admin/students', { method: 'POST', body: JSON.stringify(studentData) }),
  adminGetStudents: () => request('/auth/admin/students'),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`);
  },
  getTaskById: (id) => request(`/tasks/${id}`),
  createTask: (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  updateTask: (id, taskData) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) }),
  toggleTaskStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  bulkSyncTasks: (tasks) => request('/tasks/bulk-sync', { method: 'POST', body: JSON.stringify({ tasks }) }),

  // Placements
  getDrives: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/placements${query ? `?${query}` : ''}`);
  },
  getDriveById: (id) => request(`/placements/${id}`),
  createDrive: (driveData) => request('/placements', { method: 'POST', body: JSON.stringify(driveData) }),
  updateDrive: (id, driveData) => request(`/placements/${id}`, { method: 'PUT', body: JSON.stringify(driveData) }),
  deleteDrive: (id) => request(`/placements/${id}`, { method: 'DELETE' }),
  applyForDrive: (id, applicationData = {}) => request(`/placements/${id}/apply`, { method: 'POST', body: JSON.stringify(applicationData) }),
  getMyApplications: () => request('/placements/my/applications'),
  getAllApplications: () => request('/placements/admin/all-applications'),
  getDriveApplications: (id) => request(`/placements/${id}/applications`),
  updateApplicationStatus: (id, statusData) => request(`/placements/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify(statusData) }),

  // Stats
  getDashboardStats: () => request('/stats/dashboard'),

  // System Health
  getHealth: () => request('/health'),
};
