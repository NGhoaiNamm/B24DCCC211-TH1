import React, { useState } from 'react';
import useReviewModel, { Review } from '@/models/nhanvienvadichvu/review';
import ReviewForm from './ReviewForm';
import ReviewTable from './ReviewTable';
import { message } from 'antd';

export default function ReviewTab() {
    const { reviews, addReview, updateReview, deleteReview } = useReviewModel();
    const [editingReview, setEditingReview] = useState<Review | undefined>();

    const handleSubmit = (values: Review) => {
        if (editingReview) {
            updateReview(values);
            setEditingReview(undefined);
            message.success('Cập nhật thành công!');
        } else {
            addReview(values);
            message.success('Gửi đánh giá thành công!');
        }
    };

    return (
        <div>
            <h3>Đánh giá dịch vụ & nhân viên</h3>
            <ReviewForm editingReview={editingReview} onSubmit={handleSubmit} />
            <ReviewTable reviews={reviews} onEdit={setEditingReview} onDelete={deleteReview} />
        </div>
    );
}