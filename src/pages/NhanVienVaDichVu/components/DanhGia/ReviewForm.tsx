import React, { useEffect } from 'react';
import { Form, Input, Rate, Button } from 'antd';
import { Review } from '@/models/nhanvienvadichvu/review';

interface ReviewFormProps {
    editingReview?: Review;
    onSubmit: (values: Review) => void;
}

export default function ReviewForm({ editingReview, onSubmit }: ReviewFormProps) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingReview) {
            form.setFieldsValue(editingReview);
        } else {
            form.resetFields();
        }
    }, [editingReview, form]);

    const handleFinish = (values: any) => {
        const reviewData: Review = {
            id: editingReview?.id || Date.now().toString(),
            appointmentId: values.appointmentId || editingReview?.appointmentId || '',
            rating: values.rating,
            comment: values.comment,
            response: values.response,
            createdAt: editingReview?.createdAt || new Date().toISOString(),
        };

        onSubmit(reviewData);
        form.resetFields();
    };

    const isResponseMode = editingReview && editingReview.comment;

    return (
        <Form form={form} layout="vertical" onFinish={handleFinish}>
            {!isResponseMode && (
                <>
                    <Form.Item
                        name="rating"
                        label="Đánh giá"
                        rules={[{ required: true, message: 'Vui lòng chọn rating!' }]}
                    >
                        <Rate />
                    </Form.Item>

                    <Form.Item name="comment" label="Nhận xét">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </>
            )}

            <Form.Item name="response" label="Phản hồi nhân viên">
                <Input.TextArea rows={2} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {editingReview ? 'Cập nhật' : 'Gửi đánh giá'}
                </Button>
            </Form.Item>
        </Form>
    );
}