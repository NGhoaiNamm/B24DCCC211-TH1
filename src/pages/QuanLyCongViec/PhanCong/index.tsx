import React from 'react';
import { Card, Table, Tag } from 'antd';
import { useSelector } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import LoginModal from '../components/LoginModal';
import moment from 'moment';

const PhanCong: React.FC = () => {
	const { currentUser, danhSach } = useSelector((state: any) => state.quanLyCongViec);

	const columns = [
		{
			title: 'Tên công việc',
			dataIndex: 'tenCongViec',
			key: 'tenCongViec',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Mức độ ưu tiên',
			dataIndex: 'mucDoUuTien',
			key: 'mucDoUuTien',
			render: (priority: string) => {
				const colors = { High: 'red', Medium: 'orange', Low: 'green' };
				const labels = { High: 'Cao', Medium: 'Trung bình', Low: 'Thấp' };
				return <Tag color={colors[priority as keyof typeof colors]}>{labels[priority as keyof typeof labels]}</Tag>;
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			key: 'trangThai',
			render: (status: string) => {
				const colors = { Todo: 'default', Doing: 'processing', Done: 'success' };
				const labels = { Todo: 'Chưa làm', Doing: 'Đang làm', Done: 'Đã xong' };
				return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>;
			},
		},
		{
			title: 'Thời hạn',
			dataIndex: 'thoiHan',
			key: 'thoiHan',
			render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
		},
	];

	const myTasks = danhSach?.filter((item: any) => item.nguoiDuocGiao === currentUser) || [];

	return (
		<PageContainer>
			<LoginModal visible={!currentUser} />
			<Card title={`Công việc được giao cho: ${currentUser || ''}`}>
				<Table
					columns={columns}
					dataSource={myTasks}
					rowKey='id'
					pagination={{ pageSize: 10 }}
				/>
			</Card>
		</PageContainer>
	);
};

export default PhanCong;
