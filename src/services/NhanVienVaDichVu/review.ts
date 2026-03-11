import { Review } from "@/models/nhanvienvadichvu/review";

const STORAGE_KEY = 'reviews_data';

export function getReviews(): Review[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to parse reviews from storage', e);
        return [];
    }
}

export function saveReviews(data: Review[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}