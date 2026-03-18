import { Button, DatePicker, Form, Input, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormQuyetDinh = () => {
  const [form] = Form.useForm();
  const { record, visibleForm, setVisibleForm, postModel, putModel, edit } =
    useModel('vanbang.quyetDinh');
  const { danhSach: danhSachSo, getAllModel: getAllSo } = useModel(
    'vanbang.soVanBang',
  );

  useEffect(() => {
    getAllSo();
  }, []);

  useEffect(() => {
    if (visibleForm) {
      if (edit && record) {
        form.setFieldsValue({
          ...record,
          ngayBanHanh: record.ngayBanHanh ? moment(record.ngayBanHanh) : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visibleForm, edit, record]);

  const onFinish = async (values: any) => {
    const payload = {
      ...values,
      ngayBanHanh: values.ngayBanHanh ? values.ngayBanHanh.toISOString() : undefined,
    };
    if (edit) {
      await putModel(record?._id as string, payload);
    } else {
      await postModel(payload);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="soQuyetDinh"
          label="Số Quyết Định"
          rules={[{ required: true, message: 'Vui lòng nhập số quyết định!' }]}
        >
          <Input placeholder="Ví dụ: 123/QĐ-TN" />
        </Form.Item>
        <Form.Item
          name="ngayBanHanh"
          label="Ngày Ban Hành"
          rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item
          name="trichYeu"
          label="Trích Yếu"
          rules={[{ required: true, message: 'Vui lòng nhập trích yếu!' }]}
        >
          <Input.TextArea rows={4} placeholder="Nội dung trích yếu quyết định..." />
        </Form.Item>
        <Form.Item
          name="soVanBangId"
          label="Thuộc Sổ Văn Bằng"
          rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
        >
          <Select placeholder="Chọn sổ văn bằng" showSearch>
            {danhSachSo?.map((s: any) => (
              <Select.Option key={s._id} value={s._id}>
                {s.tenSo} ({s.nam})
              </Select.Option>
            ))}
          </Select>
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

export default FormQuyetDinh;
