import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import type { Destination } from '@/models/quanLyDuLich';

const { Option } = Select;

interface DestinationFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Destination, 'id'> | Destination) => void;
  initialValue?: Destination | null;
}

const DestinationForm = ({ visible, onClose, onSubmit, initialValue }: DestinationFormProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={initialValue ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến'}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values as any);
          form.resetFields();
          onClose();
        });
      }}
    >
      <Form
        form={form}
        initialValues={initialValue || {
          type: 'biển',
          rating: 4,
          price: 1000000,
          duration: 120,
          costAnUong: 300000,
          costLuuTru: 700000,
          costDiChuyen: 200000,
        }}
        layout='vertical'
      >
        <Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='type' label='Loại hình' rules={[{ required: true }]}>
          <Select>
            <Option value='biển'>Biển</Option>
            <Option value='núi'>Núi</Option>
            <Option value='thành phố'>Thành phố</Option>
          </Select>
        </Form.Item>
        <Form.Item name='price' label='Giá (VND)' rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name='rating' label='Rating' rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} max={5} step={0.1} />
        </Form.Item>
        <Form.Item name='duration' label='Thời gian tham quan (phút)' rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
        <Form.Item name='costAnUong' label='Chi phí ăn uống' rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name='costLuuTru' label='Chi phí lưu trú' rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name='costDiChuyen' label='Chi phí di chuyển' rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name='image' label='URL hình ảnh' rules={[{ required: true, message: 'Cần URL ảnh hoặc link ảnh' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='description' label='Mô tả'>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DestinationForm;
