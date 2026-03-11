import { useState, useEffect } from "react";
import { getReviews, saveReviews } from "@/services/NhanVienVaDichVu/review";

export interface Review {
    id: string;
    appointmentId: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export default function useReviewModel() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        setReviews(getReviews());
    }, []);

    const addReview = (review: Review) => {
        const newData = [...reviews, review];
        setReviews(newData);
        saveReviews(newData);
    };

    const deleteReview = (id: string) => {
        const newData = reviews.filter((r) => r.id !== id);
        setReviews(newData);
        saveReviews(newData);
    };

    const getReviewsByAppointment = (appointmentId: string) => {
        return reviews.filter((r) => r.appointmentId === appointmentId);
    };

    return {
        reviews,
        addReview,
        deleteReview,
        getReviewsByAppointment,
    };
}