import { Button, Card, Col, DatePicker, Descriptions, Form, Input, message, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const TraCuuVanBang = () => {
  const [form] = Form.useForm();
  const { getAllModel: getAllVanBang } = useModel('vanbang.thongTinVanBang');
  const { danhSach: danhSachQuyetDinh, getAllModel: getAllQuyetDinh, putModel: updateQuyetDinh } =
    useModel('vanbang.quyetDinh');
  const { danhSach: danhSachSo, getAllModel: getAllSo } = useModel('vanbang.soVanBang');
  
  const [result, setResult] = useState<VanBang.IThongTinVanBang | null>(null);

  useEffect(() => {
    getAllQuyetDinh();
    getAllSo();
  }, []);

  const onSearch = async (values: any) => {
    const filledKeys = Object.keys(values).filter((key) => values[key]);
    if (filledKeys.length < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số để tra cứu!');
      return;
    }

    const allVanBang = await getAllVanBang();
    
    // Tìm kiếm chính xác theo các field được nhập
    const found = allVanBang.find((vb) => {
      let isMatch = true;
      if (values.soHieuVanBang && vb.soHieuVanBang !== values.soHieuVanBang) isMatch = false;
      if (values.soVaoSo && vb.soVaoSo !== values.soVaoSo) isMatch = false;
      if (values.maSinhVien && vb.maSinhVien !== values.maSinhVien) isMatch = false;
      if (values.hoTen && vb.hoTen?.toLowerCase() !== values.hoTen.toLowerCase()) isMatch = false;
      if (values.ngaySinh) {
        if (!vb.ngaySinh || moment(vb.ngaySinh).format('YYYY-MM-DD') !== values.ngaySinh.format('YYYY-MM-DD')) {
          isMatch = false;
        }
      }
      return isMatch;
    });

    if (found) {
      setResult(found);
      message.success('Tìm thấy thông tin văn bằng!');
      
      // Ghi nhận lượt tra cứu
      const qd = danhSachQuyetDinh?.find((item: any) => item._id === found.quyetDinhId);
      if (qd) {
        await updateQuyetDinh(qd._id, { soLuotTraCuu: (qd.soLuotTraCuu || 0) + 1 }, undefined, true);
        getAllQuyetDinh(); // reload latest data into list
      }
    } else {
      setResult(null);
      message.error('Không tìm thấy thông tin văn bằng phù hợp!');
    }
  };

  const currentQd = danhSachQuyetDinh?.find((q: any) => q._id === result?.quyetDinhId);
  const currentSo = danhSachSo?.find((s: any) => s._id === currentQd?.soVanBangId);

  return (
    <Card title="Tra Cứu Thông Tin Văn Bằng" bordered={false}>
      <Form form={form} layout="vertical" onFinish={onSearch}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="soHieuVanBang" label="Số Hiệu Văn Bằng">
              <Input placeholder="Nhập số hiệu văn bằng" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="soVaoSo" label="Số Vào Sổ">
              <Input placeholder="Nhập số vào sổ" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maSinhVien" label="Mã Sinh Viên">
              <Input placeholder="Nhập mã sinh viên" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="hoTen" label="Họ Tên">
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ngaySinh" label="Ngày Sinh">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày sinh" />
            </Form.Item>
          </Col>
          <Col span={8} style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Tra Cứu
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => { form.resetFields(); setResult(null); }}>
              Làm Mới
            </Button>
          </Col>
        </Row>
      </Form>

      {result && (
        <Descriptions title="Chi Tiết Văn Bằng" bordered column={2} style={{ marginTop: 24 }}>
          <Descriptions.Item label="Họ Tên">{result.hoTen}</Descriptions.Item>
          <Descriptions.Item label="Ngày Sinh">
            {result.ngaySinh ? moment(result.ngaySinh).format('DD/MM/YYYY') : ''}
          </Descriptions.Item>
          <Descriptions.Item label="Mã Sinh Viên">{result.maSinhVien}</Descriptions.Item>
          <Descriptions.Item label="Số Hiệu Văn Bằng">{result.soHieuVanBang}</Descriptions.Item>
          <Descriptions.Item label="Số Vào Sổ">{result.soVaoSo}</Descriptions.Item>
          <Descriptions.Item label="Quyết Định Tốt Nghiệp">{currentQd?.soQuyetDinh}</Descriptions.Item>
          
          <Descriptions.Item label="Ngày Quyết Định" span={2}>
            {currentQd?.ngayBanHanh ? moment(currentQd.ngayBanHanh).format('DD/MM/YYYY') : ''}
          </Descriptions.Item>
          <Descriptions.Item label="Sổ cấp bằng" span={2}>
            {currentSo?.tenSo} ({currentSo?.nam})
          </Descriptions.Item>
          
          {result.truongDong && Object.keys(result.truongDong).map((key) => {
             const val = result.truongDong[key];
             const isDate = typeof val === 'string' && val.includes('T') && val.includes('Z');
             return (
               <Descriptions.Item label={key} key={key} span={2}>
                 {isDate ? moment(val).format('DD/MM/YYYY') : val}
               </Descriptions.Item>
             );
          })}
        </Descriptions>
      )}
    </Card>
  );
};

export default TraCuuVanBang;
