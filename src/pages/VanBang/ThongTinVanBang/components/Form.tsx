import { Button, DatePicker, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormThongTinVanBang = () => {
  const [form] = Form.useForm();
  const { record, visibleForm, setVisibleForm, postModel, putModel, edit } =
    useModel('vanbang.thongTinVanBang');
  
  const { danhSach: danhSachQuyetDinh, getAllModel: getAllQuyetDinh } = useModel(
    'vanbang.quyetDinh',
  );
  
  const { danhSach: danhSachCauHinh, getAllModel: getAllCauHinh } = useModel(
    'vanbang.cauHinh',
  );

  useEffect(() => {
    getAllQuyetDinh();
    getAllCauHinh();
  }, []);

  useEffect(() => {
    if (visibleForm) {
      if (edit && record) {
        const initialTruongDong: Record<string, any> = {};
        if (record.truongDong) {
          danhSachCauHinh.forEach((ch: any) => {
            const val = record.truongDong[ch.tenTruong];
            initialTruongDong[ch.tenTruong] = (ch.loaiDuLieu === 'Date' && val) ? moment(val) : val;
          });
        }
        form.setFieldsValue({
          ...record,
          ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
          truongDong: initialTruongDong,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visibleForm, edit, record, danhSachCauHinh]);

  const onFinish = async (values: any) => {
    const processedTruongDong: Record<string, any> = {};
    if (values.truongDong) {
      Object.keys(values.truongDong).forEach((key) => {
        const val = values.truongDong[key];
        const config = danhSachCauHinh?.find((ch: any) => ch.tenTruong === key);
        processedTruongDong[key] = (config?.loaiDuLieu === 'Date' && val) ? val.toISOString() : val;
      });
    }

    const payload = {
      ...values,
      ngaySinh: values.ngaySinh ? values.ngaySinh.toISOString() : undefined,
      truongDong: processedTruongDong,
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="quyetDinhId"
              label="Quyết Định Tốt Nghiệp"
              rules={[{ required: true, message: 'Vui lòng chọn quyết định!' }]}
            >
              <Select placeholder="Chọn quyết định" showSearch>
                {danhSachQuyetDinh?.map((q: any) => (
                  <Select.Option key={q._id} value={q._id}>
                    {q.soQuyetDinh}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            {edit && (
              <Form.Item name="soVaoSo" label="Số Vào Sổ (Tự động)">
                <Input disabled />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="soHieuVanBang"
              label="Số Hiệu Văn Bằng"
              rules={[{ required: true, message: 'Vui lòng nhập số hiệu!' }]}
            >
              <Input placeholder="Ví dụ: B123456" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="maSinhVien"
              label="Mã Sinh Viên"
              rules={[{ required: true, message: 'Vui lòng nhập MSV!' }]}
            >
              <Input placeholder="Ví dụ: B24DCCC211" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="hoTen"
              label="Họ Tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input placeholder="Ví dụ: Nguyễn Văn A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ngaySinh"
              label="Ngày Sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        {danhSachCauHinh?.length > 0 && <h3>Thông tin thêm (Tính động)</h3>}
        <Row gutter={16}>
          {danhSachCauHinh?.map((ch: any) => {
            let inputControl = <Input placeholder="Nhập Text..." />;
            if (ch.loaiDuLieu === 'Number') {
              inputControl = <InputNumber style={{ width: '100%' }} placeholder="Nhập số..." />;
            } else if (ch.loaiDuLieu === 'Date') {
              inputControl = <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />;
            }

            return (
              <Col span={12} key={ch._id}>
                <Form.Item
                  name={['truongDong', ch.tenTruong]}
                  label={ch.tenTruong}
                  rules={[{ required: ch.batBuoc, message: `Vui lòng nhập ${ch.tenTruong}!` }]}
                >
                  {inputControl}
                </Form.Item>
              </Col>
            );
          })}
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Lưu
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormThongTinVanBang;
