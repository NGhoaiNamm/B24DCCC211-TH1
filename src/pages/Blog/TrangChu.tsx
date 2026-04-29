import React, { useEffect, useState, useMemo } from 'react';
import { Card, Input, Tag, Row, Col, Pagination, Typography, Avatar, Space } from 'antd';
import { SearchOutlined, UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { Article, Tag as TagType, getArticles, getTags, initMockData } from './utils';
import styles from './TrangChu.less';

const { Title, Paragraph, Text } = Typography;

const TrangChu: React.FC = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const [tags, setTags] = useState<TagType[]>([]);
	const [searchText, setSearchText] = useState('');
	const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 9;

	useEffect(() => {
		initMockData();
		setArticles(getArticles().filter((a) => a.status === 'Published'));
		setTags(getTags());
	}, []);

	const handleSearch = useMemo(
		() =>
			debounce((value: string) => {
				setSearchText(value.toLowerCase());
				setCurrentPage(1); // Reset to page 1 on search
			}, 300),
		[],
	);

	const filteredArticles = useMemo(() => {
		return articles.filter((article) => {
			const matchTitleOrSummary =
				(article.title || '').toLowerCase().includes(searchText) ||
				(article.summary || '').toLowerCase().includes(searchText);
			const matchTag = selectedTagId ? article.tags.includes(selectedTagId) : true;
			return matchTitleOrSummary && matchTag;
		});
	}, [articles, searchText, selectedTagId]);

	// Calculate paginated articles
	const currentArticles = filteredArticles.slice(
		(currentPage - 1) * pageSize,
		currentPage * pageSize,
	);

	const toggleTagFilter = (tagId: string) => {
		setSelectedTagId((prev) => (prev === tagId ? null : tagId));
		setCurrentPage(1);
	};

	const getTagName = (tagId: string) => {
		const tag = tags.find((t) => t.id === tagId);
		return tag ? tag.name : '';
	};

	return (
		<div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
			<Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
				Blog Cá Nhân
			</Title>

			<Row gutter={[24, 24]}>
				{/* Sidebar: Search & Tags */}
				<Col xs={24} md={6}>
					<Card title="Tìm kiếm" bordered={false} style={{ marginBottom: '24px' }}>
						<Input
							placeholder="Nhập từ khóa..."
							prefix={<SearchOutlined />}
							onChange={(e) => handleSearch(e.target.value)}
							allowClear
						/>
					</Card>
					<Card title="Thẻ (Tags)" bordered={false}>
						<Space size={[0, 8]} wrap>
							{tags.map((tag) => (
								<Tag
									key={tag.id}
									color={selectedTagId === tag.id ? 'blue' : 'default'}
									style={{ cursor: 'pointer', padding: '4px 8px', fontSize: '14px' }}
									onClick={() => toggleTagFilter(tag.id)}
								>
									{tag.name} ({tag.usageCount})
								</Tag>
							))}
						</Space>
					</Card>
				</Col>

				{/* Main Content: Article List */}
				<Col xs={24} md={18}>
					<Row gutter={[24, 24]}>
						{currentArticles.length > 0 ? (
							currentArticles.map((article) => (
								<Col xs={24} sm={12} lg={8} key={article.id}>
									<Card
										hoverable
										cover={
											article.imageUrl ? (
												<div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
													<img
														alt={article.title}
														src={article.imageUrl}
														style={{ width: '100%', height: '100%', objectFit: 'cover' }}
														onError={(e) => {
															(e.target as HTMLImageElement).style.display = 'none';
															(e.target as HTMLImageElement).parentElement!.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999;">Không có ảnh</div>';
														}}
													/>
												</div>
											) : (
												<div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
													<span style={{ color: '#999' }}>Không có ảnh</span>
												</div>
											)
										}
										onClick={() => history.push(`/blog/${article.slug}`)}
										style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
										bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
									>
										<div style={{ marginBottom: '12px' }}>
											{article.tags.map((tagId) => (
												<Tag color="cyan" key={tagId} style={{ marginBottom: '4px' }}>
													{getTagName(tagId)}
												</Tag>
											))}
										</div>
										<Title level={4} style={{ marginBottom: '12px', fontSize: '18px' }} ellipsis={{ rows: 2 }}>
											{article.title}
										</Title>
										<Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ flex: 1 }}>
											{article.summary}
										</Paragraph>
										<div
											style={{
												marginTop: '16px',
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												borderTop: '1px solid #f0f0f0',
												paddingTop: '12px',
											}}
										>
											<Space>
												<Avatar src={article.author.avatar} icon={<UserOutlined />} size="small" />
												<Text type="secondary" style={{ fontSize: '12px' }}>
													{article.author.name}
												</Text>
											</Space>
											<Space style={{ fontSize: '12px', color: '#8c8c8c' }}>
												<span>
													<CalendarOutlined /> {moment(article.createdAt).format('DD/MM/YYYY')}
												</span>
												<span>
													<EyeOutlined /> {article.views}
												</span>
											</Space>
										</div>
									</Card>
								</Col>
							))
						) : (
							<Col span={24}>
								<div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
									Không tìm thấy bài viết nào phù hợp.
								</div>
							</Col>
						)}
					</Row>

					{filteredArticles.length > 0 && (
						<div style={{ textAlign: 'center', marginTop: '40px' }}>
							<Pagination
								current={currentPage}
								pageSize={pageSize}
								total={filteredArticles.length}
								onChange={(page) => setCurrentPage(page)}
								showSizeChanger={false}
							/>
						</div>
					)}
				</Col>
			</Row>
		</div>
	);
};

export default TrangChu;
