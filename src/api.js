const BASE_URL = import.meta.env.VITE_API_URL;

// AUTH
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};

// PROJECTS
export const getProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects`);
  return res.json();
};

export const createProject = async (data, token) => {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

// PROPOSALS
export const createProposal = async (data, token) => {
  const res = await fetch(`${BASE_URL}/proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getMyProposals = async (token) => {
  const res = await fetch(`${BASE_URL}/proposals/my`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};