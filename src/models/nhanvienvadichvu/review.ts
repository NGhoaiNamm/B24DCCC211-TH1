import { useState, useEffect } from "react";
import { getReviews, saveReviews } from "@/services/NhanVienVaDichVu/review";

export interface Review {
    id: string;
    appointmentId: string;
    rating: number;
    comment?: string;
    response?: string;
    createdAt: string;
}

export default function useReviewModel() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        setReviews(getReviews());
    }, []);

    const addReview = (r: Review) => {
        const newData = [...reviews, r];
        setReviews(newData);
        saveReviews(newData);
    };

    const updateReview = (u: Review) => {
        const newData = reviews.map((r) => (r.id === u.id ? u : r));
        setReviews(newData);
        saveReviews(newData);
    };

    const deleteReview = (id: string) => {
        const newData = reviews.filter((r) => r.id !== id);
        setReviews(newData);
        saveReviews(newData);
    };

    return {
        reviews,
        addReview,
        updateReview,
        deleteReview,
    };
}