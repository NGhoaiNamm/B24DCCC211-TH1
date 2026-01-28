import React, { useState, useEffect } from 'react';
import { Card, Input, List, Button, Checkbox, Modal, Icon } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Dispatch } from 'umi';
import { TodoListState, CongViec } from '@/models/todoList';

interface Props {
	dispatch: Dispatch;
	todoList: TodoListState;
}

const ToDoListForm: React.FC<Props> = ({ dispatch, todoList }) => {
	const { danhSach = [] } = todoList || {};

	const [noiDungMoi, setNoiDungMoi] = useState('');
	const [dangSua, setDangSua] = useState<CongViec | null>(null);
	const [noiDungSua, setNoiDungSua] = useState('');

	useEffect(() => {
		dispatch({ type: 'todoList/khoiTao' });
	}, [dispatch]);

	const themMoi = () => {
		if (!noiDungMoi.trim()) return;
		dispatch({ type: 'todoList/themCongViec', payload: noiDungMoi });
		setNoiDungMoi('');
	};

	const xoaItem = (id: number) => {
		Modal.confirm({
			title: 'Xóa công việc',
			content: 'Bạn có chắc chắn muốn xóa?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Hủy',
			onOk: () => dispatch({ type: 'todoList/xoaCongViec', payload: id }),
		});
	};

	const batDauSua = (item: CongViec) => {
		setDangSua(item);
		setNoiDungSua(item.noiDung);
	};

	const luuSua = () => {
		if (dangSua && noiDungSua.trim()) {
			dispatch({
				type: 'todoList/capNhatCongViec',
				payload: { ...dangSua, noiDung: noiDungSua },
			});
			setDangSua(null);
		}
	};

	const doiTrangThai = (item: CongViec) => {
		dispatch({
			type: 'todoList/capNhatCongViec',
			payload: { ...item, hoanThanh: !item.hoanThanh },
		});
	};

	return (
		<Card title='Danh Sách Công Việc' style={{ maxWidth: 800, margin: '0 auto', marginTop: 20 }}>
			<div style={{ display: 'flex', marginBottom: 20 }}>
				<Input
					placeholder='Nhập công việc...'
					value={noiDungMoi}
					onChange={(e) => setNoiDungMoi(e.target.value)}
					onPressEnter={themMoi}
					style={{ marginRight: 8 }}
				/>
				<Button type='primary' onClick={themMoi}>
					Thêm
				</Button>
			</div>

			<List
				bordered
				dataSource={danhSach}
				rowKey='id'
				locale={{ emptyText: 'Chưa có công việc nào' }}
				renderItem={(item) => (
					<List.Item
						actions={[
							<Button key='edit' type='dashed' onClick={() => batDauSua(item)} style={{ marginRight: 5 }}>
								Sửa
							</Button>,
							<Button key='delete' type='danger' onClick={() => xoaItem(item.id)}>
								Xóa
							</Button>,
						]}
					>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Checkbox checked={item.hoanThanh} onChange={() => doiTrangThai(item)} style={{ marginRight: 10 }} />
							<span
								style={{
									textDecoration: item.hoanThanh ? 'line-through' : 'none',
									color: item.hoanThanh ? '#999' : '#000',
									cursor: 'pointer',
								}}
								onClick={() => doiTrangThai(item)}
							>
								{item.noiDung}
							</span>
						</div>
					</List.Item>
				)}
			/>

			<Modal title='Sửa công việc' visible={!!dangSua} onOk={luuSua} onCancel={() => setDangSua(null)}>
				<Input value={noiDungSua} onChange={(e) => setNoiDungSua(e.target.value)} onPressEnter={luuSua} />
			</Modal>
		</Card>
	);
};

export default ToDoListForm;
