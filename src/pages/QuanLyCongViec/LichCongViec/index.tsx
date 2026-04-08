import React, { useState } from 'react';
import { Card, Modal, Tag } from 'antd';
import { useSelector } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LoginModal from '../components/LoginModal';

const localizer = momentLocalizer(moment);

const LichCongViec: React.FC = () => {
	const { currentUser, danhSach } = useSelector((state: any) => state.quanLyCongViec);
	const [selectedEvent, setSelectedEvent] = useState<any>(null);

	const events = danhSach?.map((task: any) => ({
		id: task.id,
		title: task.tenCongViec,
		start: moment(task.thoiHan).toDate(),
		end: moment(task.thoiHan).add(1, 'hour').toDate(),
		resource: task,
	})) || [];

	const eventStyleGetter = (event: any) => {
		let backgroundColor = '#3174ad';
		if (event.resource.trangThai === 'Done') backgroundColor = '#52c41a';
		if (event.resource.mucDoUuTien === 'High' && event.resource.trangThai !== 'Done') backgroundColor = '#f5222d';

		return {
			style: {
				backgroundColor,
				borderRadius: '4px',
				opacity: 0.8,
				color: 'white',
				border: '0px',
				display: 'block'
			}
		};
	};

	return (
		<PageContainer>
			<LoginModal visible={!currentUser} />
			<Card title='Lịch hoàn thành công việc'>
				<div style={{ height: '600px' }}>
					<Calendar
						localizer={localizer}
						events={events}
						startAccessor="start"
						endAccessor="end"
						style={{ height: '100%' }}
						onSelectEvent={(event) => setSelectedEvent(event.resource)}
						eventPropGetter={eventStyleGetter}
					/>
				</div>
			</Card>

			<Modal
				title="Chi tiết công việc"
				visible={!!selectedEvent}
				onCancel={() => setSelectedEvent(null)}
				footer={null}
			>
				{selectedEvent && (
					<div>
						<p><strong>Tên công việc:</strong> {selectedEvent.tenCongViec}</p>
						<p><strong>Người được giao:</strong> {selectedEvent.nguoiDuocGiao}</p>
						<p><strong>Mức độ ưu tiên:</strong> <Tag color={selectedEvent.mucDoUuTien === 'High' ? 'red' : selectedEvent.mucDoUuTien === 'Medium' ? 'orange' : 'green'}>{selectedEvent.mucDoUuTien}</Tag></p>
						<p><strong>Trạng thái:</strong> <Tag color={selectedEvent.trangThai === 'Done' ? 'success' : selectedEvent.trangThai === 'Doing' ? 'processing' : 'default'}>{selectedEvent.trangThai}</Tag></p>
						<p><strong>Thời hạn:</strong> {moment(selectedEvent.thoiHan).format('DD/MM/YYYY HH:mm')}</p>
					</div>
				)}
			</Modal>
		</PageContainer>
	);
};

export default LichCongViec;
