import { CgeData, FloodDetailsResponse } from './types';

const API_BASE_URL = 'http://localhost:3000/api';

const getHeaders = () => {
    const storage = localStorage.getItem('cge-auth-storage');
    const token = storage ? JSON.parse(storage).state.token : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
};

export async function getCgeData(): Promise<CgeData> {
    const res = await fetch(`${API_BASE_URL}/cge/data`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export async function getFloodDetails(date: string): Promise<FloodDetailsResponse> {
    const res = await fetch(`${API_BASE_URL}/cge/floods?date=${date}`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch flood details');
    return res.json();
}

export async function login(credentials: any) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Falha no login');
    }
    return res.json();
}

export async function signup(credentials: any) {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Falha no cadastro');
    }
}

export async function getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
}

export async function updateLocation(region: string) {
    const res = await fetch(`${API_BASE_URL}/auth/location`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ region }),
    });
    if (!res.ok) throw new Error('Failed to update location');
    return res.json();
}

export async function getAnalytics() {
    const res = await fetch(`${API_BASE_URL}/cge/analytics`, {
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
}

export const loginWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
};

export async function getPlaces() {
    const res = await fetch(`${API_BASE_URL}/auth/places`, {
        headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch places');
    return res.json();
}

export async function addPlace(data: { name: string, type: string, region: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/places`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add place');
    return res.json();
}

export async function updatePlace(id: number, data: any) {
    const res = await fetch(`${API_BASE_URL}/auth/places/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update place');
    return res.json();
}

export async function removePlace(id: number) {
    const res = await fetch(`${API_BASE_URL}/auth/places/remove`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to remove place');
}
