import { Button, Form, Input, Select, Switch } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormCauHinh = () => {
  const [form] = Form.useForm();
  const { record, visibleForm, setVisibleForm, postModel, putModel, edit } =
    useModel('vanbang.cauHinh');

  useEffect(() => {
    if (visibleForm) {
      if (edit && record) {
        form.setFieldsValue(record);
      } else {
        form.resetFields();
        form.setFieldsValue({ batBuoc: false, loaiDuLieu: 'String' });
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
          name="tenTruong"
          label="Tên Trường Dữ Liệu"
          rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
        >
          <Input placeholder="Ví dụ: Dân tộc, Nơi sinh..." />
        </Form.Item>
        <Form.Item
          name="loaiDuLieu"
          label="Kiểu Dữ Liệu"
          rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}
        >
          <Select>
            <Select.Option value="String">String (Chữ/Số)</Select.Option>
            <Select.Option value="Number">Number (Số)</Select.Option>
            <Select.Option value="Date">Date (Ngày tháng)</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="batBuoc" label="Bắt buộc nhập" valuePropName="checked">
          <Switch />
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

export default FormCauHinh;
