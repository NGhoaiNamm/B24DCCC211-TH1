import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Popconfirm, Input, Select, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import TaskForm from '../components/TaskForm';
import LoginModal from '../components/LoginModal';
import moment from 'moment';

const { Option } = Select;

const DanhSach: React.FC = () => {
	const dispatch = useDispatch();
	const { currentUser, danhSach } = useSelector((state: any) => state.quanLyCongViec);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingTask, setEditingTask] = useState<any>(null);
	
	const [searchText, setSearchText] = useState('');
	const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
	const [filterAssignee, setFilterAssignee] = useState<string | undefined>(undefined);

	const handleAdd = () => {
		setEditingTask(null);
		setIsModalVisible(true);
	};

	const handleEdit = (record: any) => {
		setEditingTask(record);
		setIsModalVisible(true);
	};

	const handleDelete = (id: string) => {
		dispatch({
			type: 'quanLyCongViec/xoaCongViec',
			payload: id,
		});
	};

	const handleFormSubmit = (values: any) => {
		if (editingTask) {
			dispatch({
				type: 'quanLyCongViec/capNhatCongViec',
				payload: { ...editingTask, ...values },
			});
		} else {
			dispatch({
				type: 'quanLyCongViec/themCongViec',
				payload: { id: Date.now().toString(), ...values },
			});
		}
		setIsModalVisible(false);
	};

	const columns = [
		{
			title: 'Tên công việc',
			dataIndex: 'tenCongViec',
			key: 'tenCongViec',
			render: (text: string) => <strong>{text}</strong>,
		},
		{
			title: 'Người được giao',
			dataIndex: 'nguoiDuocGiao',
			key: 'nguoiDuocGiao',
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
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: any) => (
				<Space size='middle'>
					<Button type='primary' icon={<EditOutlined />} onClick={() => handleEdit(record)} size='small'>Sửa</Button>
					<Popconfirm
						title='Bạn có chắc muốn xóa công việc này không?'
						onConfirm={() => handleDelete(record.id)}
						okText='Có'
						cancelText='Không'
					>
						<Button danger icon={<DeleteOutlined />} size='small'>Xóa</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	const filteredData = danhSach?.filter((item: any) => {
		const matchSearch = item.tenCongViec.toLowerCase().includes(searchText.toLowerCase());
		const matchStatus = filterStatus ? item.trangThai === filterStatus : true;
		const matchAssignee = filterAssignee ? item.nguoiDuocGiao === filterAssignee : true;
		return matchSearch && matchStatus && matchAssignee;
	}) || [];

	const uniqueAssignees = Array.from(new Set(danhSach?.map((item: any) => item.nguoiDuocGiao) || []));

	const handleLogout = () => {
		dispatch({ type: 'quanLyCongViec/setLogout' });
	};

	return (
		<PageContainer>
			<LoginModal visible={!currentUser} />
			
			<Card style={{ marginBottom: 16 }}>
				<Row justify="space-between" align="middle">
					<Col>
						<h3>Xin chào, <strong style={{color: '#1890ff'}}>{currentUser}</strong></h3>
					</Col>
					<Col>
						<Button onClick={handleLogout}>Đăng xuất</Button>
					</Col>
				</Row>
			</Card>

			<Card
				title='Danh sách công việc'
				extra={
					<Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
						Thêm công việc
					</Button>
				}
			>
				<Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
					<Col xs={24} sm={8}>
						<Input
							placeholder='Tìm kiếm theo tên công việc...'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={12} sm={8}>
						<Select
							placeholder='Lọc theo trạng thái'
							style={{ width: '100%' }}
							allowClear
							onChange={(val) => setFilterStatus(val)}
						>
							<Option value='Todo'>Chưa làm</Option>
							<Option value='Doing'>Đang làm</Option>
							<Option value='Done'>Đã xong</Option>
						</Select>
					</Col>
					<Col xs={12} sm={8}>
						<Select
							placeholder='Lọc theo người được giao'
							style={{ width: '100%' }}
							allowClear
							onChange={(val) => setFilterAssignee(val)}
						>
							{uniqueAssignees.map((assignee: any) => (
								<Option key={assignee} value={assignee}>{assignee}</Option>
							))}
						</Select>
					</Col>
				</Row>
				
				<Table
					columns={columns}
					dataSource={filteredData}
					rowKey='id'
					pagination={{ pageSize: 10 }}
				/>
			</Card>

			<TaskForm
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				onSubmit={handleFormSubmit}
				initialValues={editingTask}
			/>
		</PageContainer>
	);
};

export default DanhSach;
