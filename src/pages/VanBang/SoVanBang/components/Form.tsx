import { Button, Form, Input, InputNumber } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSoVanBang = () => {
  const [form] = Form.useForm();
  const { record, visibleForm, setVisibleForm, postModel, putModel, edit } =
    useModel('vanbang.soVanBang');

  useEffect(() => {
    if (visibleForm) {
      if (edit && record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }
  }, [visibleForm, edit, record]);

  const onFinish = async (values: any) => {
    if (edit) {
      await putModel(record?._id as string, values);
    } else {
      await postModel(values);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="nam"
          label="Năm"
          rules={[{ required: true, message: 'Vui lòng nhập năm!' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 2026" />
        </Form.Item>
        <Form.Item
          name="tenSo"
          label="Tên Sổ"
          rules={[{ required: true, message: 'Vui lòng nhập tên sổ!' }]}
        >
          <Input placeholder="Ví dụ: Sổ cấp bằng tốt nghiệp 2026" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Lưu
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormSoVanBang;
