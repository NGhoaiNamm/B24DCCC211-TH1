import React, { useState, useEffect } from 'react';
import {
	Card,
	Form,
	Select,
	InputNumber,
	Button,
	Table,
	message,
	Space,
	Tag,
	Tabs,
	Input,
	Row,
	Col,
	Divider,
	Modal,
	Popconfirm,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { TabPane } = Tabs;
const diffOptions = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'].map((d) => ({ value: d, label: d }));

const QuestionBank: React.FC = () => {
	const [form] = Form.useForm();
	const [editForm] = Form.useForm();

	const questionBankModel = (useModel as any)('questionBank') || {};
	const {
		categories,
		subjects,
		questions,
		examStructures,
		savedExams,
		updateCategory,
		deleteCategory,
		updateSubject,
		deleteSubject,
		updateQuestion,
		deleteQuestion,
		searchQuestions,
		generateExam,
		saveStructure,
		saveExam,
		updateExam,
		deleteExam,
	} = questionBankModel;

	const [filteredQuestions, setFilteredQuestions] = useState(questions || []);
	const [currentExam, setCurrentExam] = useState<any[]>([]);
	const [structureName, setStructureName] = useState('');
	const [examName, setExamName] = useState('');

	// STATE: Sửa Danh mục & Câu hỏi
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [editType, setEditType] = useState<'category' | 'subject' | 'question' | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);

	// STATE: Sửa Đề thi
	const [isEditingExam, setIsEditingExam] = useState(false);
	const [editingExamData, setEditingExamData] = useState<any>(null);

	useEffect(() => {
		setFilteredQuestions(questions);
	}, [questions]);

	if (!subjects) return <p>Đang tải dữ liệu...</p>;

	// --- HÀM XỬ LÝ SỬA / XÓA (DANH MỤC, CÂU HỎI) ---
	const handleOpenEdit = (type: 'category' | 'subject' | 'question', record: any) => {
		setEditType(type);
		setEditingId(record.id);
		editForm.setFieldsValue(record);
		setEditModalVisible(true);
	};

	const handleSaveEdit = () => {
		editForm.validateFields().then((values) => {
			if (editType === 'category') updateCategory(editingId!, values.name);
			else if (editType === 'subject') updateSubject(editingId!, values.name, values.credits);
			else if (editType === 'question') updateQuestion(editingId!, values);
			message.success('Cập nhật thành công!');
			setEditModalVisible(false);
		});
	};

	const handleDelete = (type: 'category' | 'subject' | 'question', id: string) => {
		if (type === 'category') deleteCategory(id);
		else if (type === 'subject') deleteSubject(id);
		else if (type === 'question') deleteQuestion(id);
		message.success('Đã xóa dữ liệu!');
	};

	// --- HÀM XỬ LÝ TÌM KIẾM & TẠO ĐỀ THI ---
	const handleSearchQuestions = (values: any) =>
		setFilteredQuestions(searchQuestions(values.subjectId, values.categoryId, values.difficulty));

	const onGenerateExam = (values: any) => {
		try {
			setCurrentExam(generateExam(values.subjectId, values.criteria));
			message.success('Tạo đề thành công!');
		} catch (e: any) {
			message.error(e.message);
		}
	};

	const handleSaveStructure = () => {
		const v = form.getFieldsValue();
		if (!structureName || !v.subjectId) return message.warning('Vui lòng nhập tên cấu trúc và chọn môn học!');
		saveStructure(structureName, v.subjectId, v.criteria);
		message.success('Đã lưu cấu trúc!');
		setStructureName('');
	};

	const handleLoadStructure = (structureId: string) => {
		const structure = examStructures.find((s: any) => s.id === structureId);
		if (structure) {
			form.setFieldsValue({ subjectId: structure.subjectId, criteria: structure.criteria });
			message.info(`Đã tải cấu trúc: ${structure.name}`);
		}
	};

	const handleSaveExam = () => {
		if (!examName) return message.warning('Nhập tên đề thi!');
		saveExam(examName, currentExam);
		message.success('Đã lưu đề!');
		setCurrentExam([]);
		setExamName('');
	};

	// --- HÀM XỬ LÝ SỬA ĐỀ THI ---
	const openEditModal = (exam: any) => {
		setEditingExamData(exam);
		setIsEditingExam(true);
	};
	const removeQuestionFromExam = (questionId: string) => {
		if (editingExamData)
			setEditingExamData({
				...editingExamData,
				questions: editingExamData.questions.filter((q: any) => q.id !== questionId),
			});
	};
	const saveEditedExam = () => {
		if (editingExamData) {
			updateExam(editingExamData.id, editingExamData.name, editingExamData.questions);
			message.success('Cập nhật đề thi thành công!');
			setIsEditingExam(false);
		}
	};

	// --- CỘT BẢNG THAO TÁC ---
	const actionColumn = (type: 'category' | 'subject' | 'question') => ({
		title: 'Thao tác',
		render: (_: any, record: any) => (
			<Space>
				<Button size='small' type='primary' onClick={() => handleOpenEdit(type, record)}>
					Sửa
				</Button>
				<Popconfirm title='Bạn có chắc muốn xóa?' onConfirm={() => handleDelete(type, record.id)}>
					<Button size='small' danger>
						Xóa
					</Button>
				</Popconfirm>
			</Space>
		),
	});

	return (
		<Card title='Hệ thống Quản lý Ngân hàng Câu hỏi Tự luận'>
			<Tabs defaultActiveKey='4'>
				{/* TAB 1 & 2: DANH MỤC ĐẦY ĐỦ */}
				<TabPane tab='1 & 2. Danh mục' key='1'>
					<Row gutter={24}>
						<Col span={10}>
							<h4>Danh mục Khối kiến thức</h4>
							<Table
								dataSource={categories}
								rowKey='id'
								pagination={false}
								columns={[
									{ title: 'Mã', dataIndex: 'id' },
									{ title: 'Tên khối', dataIndex: 'name' },
									actionColumn('category'),
								]}
							/>
						</Col>
						<Col span={14}>
							<h4>Danh mục Môn học</h4>
							<Table
								dataSource={subjects}
								rowKey='id'
								pagination={false}
								columns={[
									{ title: 'Mã', dataIndex: 'id' },
									{ title: 'Tên môn', dataIndex: 'name' },
									{ title: 'Số tín chỉ', dataIndex: 'credits' },
									actionColumn('subject'),
								]}
							/>
						</Col>
					</Row>
				</TabPane>

				{/* TAB 3: QUẢN LÝ CÂU HỎI ĐẦY ĐỦ */}
				<TabPane tab='3. Quản lý câu hỏi' key='3'>
					<Form layout='inline' onFinish={handleSearchQuestions} style={{ marginBottom: 16 }}>
						<Form.Item name='subjectId'>
							<Select
								placeholder='Chọn môn học'
								options={subjects.map((s: any) => ({ value: s.id, label: s.name }))}
								allowClear
								style={{ width: 150 }}
							/>
						</Form.Item>
						<Form.Item name='categoryId'>
							<Select
								placeholder='Khối kiến thức'
								options={categories.map((c: any) => ({ value: c.id, label: c.name }))}
								allowClear
								style={{ width: 150 }}
							/>
						</Form.Item>
						<Form.Item name='difficulty'>
							<Select placeholder='Mức độ khó' options={diffOptions} allowClear style={{ width: 120 }} />
						</Form.Item>
						<Form.Item>
							<Button type='primary' htmlType='submit'>
								Tìm kiếm
							</Button>
						</Form.Item>
					</Form>
					<Table
						dataSource={filteredQuestions}
						rowKey='id'
						columns={[
							{
								title: 'Môn học',
								dataIndex: 'subjectId',
								render: (id: string) => subjects.find((s: any) => s.id === id)?.name,
							},
							{
								title: 'Khối KT',
								dataIndex: 'categoryId',
								render: (id: string) => categories.find((c: any) => c.id === id)?.name,
							},
							{ title: 'Độ khó', dataIndex: 'difficulty', render: (d: string) => <Tag color='blue'>{d}</Tag> },
							{ title: 'Nội dung', dataIndex: 'content' },
							actionColumn('question'),
						]}
					/>
				</TabPane>

				{/* TAB 4: QUẢN LÝ ĐỀ THI ĐẦY ĐỦ */}
				<TabPane tab='4. Quản lý đề thi' key='4'>
					<Row gutter={32}>
						<Col span={13}>
							<Card title='Tạo Đề Thi Theo Cấu Trúc' type='inner'>
								{examStructures.length > 0 && (
									<div style={{ marginBottom: 16 }}>
										<b>Sử dụng cấu trúc đã lưu: </b>
										<Select
											style={{ width: 250 }}
											placeholder='Chọn cấu trúc...'
											onChange={handleLoadStructure}
											options={examStructures.map((s: any) => ({ value: s.id, label: s.name }))}
										/>
										<Divider />
									</div>
								)}
								<Form form={form} layout='vertical' onFinish={onGenerateExam} initialValues={{ criteria: [{}] }}>
									<Form.Item name='subjectId' label='Môn học' rules={[{ required: true }]}>
										<Select options={subjects.map((s: any) => ({ value: s.id, label: s.name }))} />
									</Form.Item>
									<Form.List name='criteria'>
										{(fields, { add, remove }) => (
											<>
												{fields.map(({ key, name, ...restField }) => (
													<Space key={key} style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
														<Form.Item
															{...restField}
															name={[name, 'categoryId']}
															rules={[{ required: true, message: 'Chọn khối KT' }]}
														>
															<Select
																placeholder='Khối kiến thức'
																options={categories.map((c: any) => ({ value: c.id, label: c.name }))}
																style={{ width: 130 }}
															/>
														</Form.Item>
														<Form.Item
															{...restField}
															name={[name, 'difficulty']}
															rules={[{ required: true, message: 'Chọn độ khó' }]}
														>
															<Select placeholder='Mức độ' options={diffOptions} style={{ width: 110 }} />
														</Form.Item>
														<Form.Item
															{...restField}
															name={[name, 'count']}
															rules={[{ required: true, message: 'Nhập SL' }]}
														>
															<InputNumber placeholder='SL' min={1} style={{ width: 70 }} />
														</Form.Item>
														{fields.length > 1 && (
															<MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
														)}
													</Space>
												))}
												<Form.Item>
													<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
														Thêm cấu trúc câu hỏi
													</Button>
												</Form.Item>
											</>
										)}
									</Form.List>
									<Space>
										<Button type='primary' htmlType='submit'>
											Sinh đề thi ngẫu nhiên
										</Button>
										<Input
											placeholder='Tên cấu trúc (để lưu)'
											value={structureName}
											onChange={(e) => setStructureName(e.target.value)}
										/>
										<Button onClick={handleSaveStructure}>Lưu cấu trúc này</Button>
									</Space>
								</Form>
							</Card>
						</Col>

						<Col span={11}>
							{currentExam.length > 0 && (
								<Card
									title='Đề Thi Vừa Tạo (Chưa lưu)'
									type='inner'
									style={{ borderColor: '#52c41a', marginBottom: 16 }}
								>
									<Table
										dataSource={currentExam}
										rowKey='id'
										pagination={false}
										size='small'
										columns={[
											{ title: 'Nội dung', dataIndex: 'content' },
											{ title: 'Độ khó', dataIndex: 'difficulty', render: (d) => <Tag>{d}</Tag> },
										]}
									/>
									<Divider />
									<Space>
										<Input
											placeholder='Nhập tên đề thi để lưu'
											value={examName}
											onChange={(e) => setExamName(e.target.value)}
										/>
										<Button type='primary' style={{ background: '#52c41a' }} onClick={handleSaveExam}>
											Lưu Đề Thi Mới
										</Button>
									</Space>
								</Card>
							)}

							<Card title='Kho Đề Thi Đã Lưu' type='inner'>
								<Table
									dataSource={savedExams}
									rowKey='id'
									size='small'
									pagination={{ pageSize: 5 }}
									columns={[
										{ title: 'Tên đề thi', dataIndex: 'name' },
										{ title: 'Số câu', render: (_, record: any) => record.questions.length },
										{
											title: 'Thao tác',
											render: (_, record: any) => (
												<Space>
													<Button size='small' type='primary' onClick={() => openEditModal(record)}>
														Xem/Sửa
													</Button>
													<Popconfirm title='Xóa đề thi này?' onConfirm={() => deleteExam(record.id)}>
														<Button size='small' danger>
															Xóa
														</Button>
													</Popconfirm>
												</Space>
											),
										},
									]}
								/>
							</Card>
						</Col>
					</Row>
				</TabPane>
			</Tabs>

			{/* MODAL SỬA CHUNG (DANH MỤC, CÂU HỎI) */}
			<Modal
				title={`Chỉnh sửa ${
					editType === 'category' ? 'Khối kiến thức' : editType === 'subject' ? 'Môn học' : 'Câu hỏi'
				}`}
				visible={editModalVisible}
				onOk={handleSaveEdit}
				onCancel={() => setEditModalVisible(false)}
				okText='Lưu thay đổi'
				cancelText='Hủy'
			>
				<Form form={editForm} layout='vertical'>
					{(editType === 'category' || editType === 'subject') && (
						<Form.Item name='name' label='Tên' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
					)}
					{editType === 'subject' && (
						<Form.Item name='credits' label='Số tín chỉ' rules={[{ required: true }]}>
							<InputNumber min={1} />
						</Form.Item>
					)}
					{editType === 'question' && (
						<>
							<Form.Item name='subjectId' label='Môn học'>
								<Select options={subjects.map((s: any) => ({ value: s.id, label: s.name }))} />
							</Form.Item>
							<Form.Item name='categoryId' label='Khối KT'>
								<Select options={categories.map((c: any) => ({ value: c.id, label: c.name }))} />
							</Form.Item>
							<Form.Item name='difficulty' label='Độ khó'>
								<Select options={diffOptions} />
							</Form.Item>
							<Form.Item name='content' label='Nội dung câu hỏi'>
								<Input.TextArea rows={3} />
							</Form.Item>
						</>
					)}
				</Form>
			</Modal>

			{/* MODAL SỬA ĐỀ THI */}
			<Modal
				title='Xem và Chỉnh sửa Đề thi'
				visible={isEditingExam}
				onOk={saveEditedExam}
				onCancel={() => setIsEditingExam(false)}
				width={800}
				okText='Lưu thay đổi'
				cancelText='Hủy'
			>
				{editingExamData && (
					<>
						<Input
							addonBefore='Tên đề thi'
							value={editingExamData.name}
							onChange={(e) => setEditingExamData({ ...editingExamData, name: e.target.value })}
							style={{ marginBottom: 16 }}
						/>
						<Table
							dataSource={editingExamData.questions}
							rowKey='id'
							pagination={false}
							size='small'
							columns={[
								{ title: 'Mã', dataIndex: 'id' },
								{ title: 'Nội dung', dataIndex: 'content' },
								{ title: 'Độ khó', dataIndex: 'difficulty', render: (d: string) => <Tag>{d}</Tag> },
								{
									title: 'Hành động',
									render: (_, record: any) => (
										<Button size='small' danger onClick={() => removeQuestionFromExam(record.id)}>
											Loại bỏ câu này
										</Button>
									),
								},
							]}
						/>
					</>
				)}
			</Modal>
		</Card>
	);
};

export default QuestionBank;
