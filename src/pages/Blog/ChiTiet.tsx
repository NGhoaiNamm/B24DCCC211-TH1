import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Row, Col, Avatar, Space, Button, Divider } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, history } from 'umi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import moment from 'moment';
import { Article, getArticles, getTags, incrementViewCount, Tag as TagType } from './utils';

const { Title, Paragraph, Text } = Typography;

const ChiTiet: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const [article, setArticle] = useState<Article | null>(null);
	const [tags, setTags] = useState<TagType[]>([]);
	const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

	useEffect(() => {
		const allArticles = getArticles();
		const allTags = getTags();
		setTags(allTags);

		const currentArticle = allArticles.find((a) => a.slug === slug);

		if (currentArticle) {
			setArticle(currentArticle);

			// Increment view count
			incrementViewCount(currentArticle.id);

			// Find related articles (share at least one tag, excluding current)
			const related = allArticles
				.filter(
					(a) =>
						a.id !== currentArticle.id &&
						a.status === 'Published' &&
						a.tags.some((tagId) => currentArticle.tags.includes(tagId)),
				)
				.slice(0, 3); // max 3 related articles
			setRelatedArticles(related);
		} else {
			// Handle not found
			setArticle(null);
		}
	}, [slug]);

	const getTagName = (tagId: string) => {
		const tag = tags.find((t) => t.id === tagId);
		return tag ? tag.name : '';
	};

	if (!article) {
		return (
			<div style={{ textAlign: 'center', padding: '100px 20px' }}>
				<Title level={3}>Không tìm thấy bài viết</Title>
				<Button type="primary" onClick={() => history.push('/blog')} icon={<ArrowLeftOutlined />}>
					Quay lại danh sách
				</Button>
			</div>
		);
	}

	return (
		<div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
			<Button
				type="link"
				icon={<ArrowLeftOutlined />}
				onClick={() => history.push('/blog')}
				style={{ marginBottom: '24px', paddingLeft: 0 }}
			>
				Danh sách bài viết
			</Button>

			<Card bordered={false} style={{ borderRadius: '12px', overflow: 'hidden' }}>
				{/* Article Header */}
				<div style={{ marginBottom: '24px' }}>
					<div style={{ marginBottom: '16px' }}>
						{article.tags.map((tagId) => (
							<Tag color="cyan" key={tagId} style={{ fontSize: '14px', padding: '4px 8px' }}>
								{getTagName(tagId)}
							</Tag>
						))}
					</div>
					<Title level={1} style={{ marginTop: 0, marginBottom: '24px' }}>
						{article.title}
					</Title>
					<Space size="large" style={{ color: '#8c8c8c' }}>
						<Space>
							<Avatar src={article.author.avatar} icon={<UserOutlined />} />
							<Text strong>{article.author.name}</Text>
						</Space>
						<Space>
							<CalendarOutlined />
							<span>{moment(article.createdAt).format('DD MMMM YYYY')}</span>
						</Space>
						<Space>
							<EyeOutlined />
							<span>{article.views + 1} lượt xem</span>
						</Space>
					</Space>
				</div>

				{/* Cover Image */}
				{article.imageUrl && (
					<div style={{ marginBottom: '32px', borderRadius: '8px', overflow: 'hidden' }}>
						<img
							src={article.imageUrl}
							alt={article.title}
							style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }}
						/>
					</div>
				)}

				{/* Markdown Content */}
				<div className="markdown-body" style={{ fontSize: '16px', lineHeight: '1.8' }}>
					<ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
				</div>
			</Card>

			{/* Related Articles */}
			{relatedArticles.length > 0 && (
				<div style={{ marginTop: '48px' }}>
					<Title level={3}>Bài viết liên quan</Title>
					<Divider style={{ marginTop: '12px', marginBottom: '24px' }} />
					<Row gutter={[24, 24]}>
						{relatedArticles.map((relArticle) => (
							<Col xs={24} sm={12} md={8} key={relArticle.id}>
								<Card
									hoverable
									cover={
										<div style={{ height: '150px', overflow: 'hidden' }}>
											<img
												alt={relArticle.title}
												src={relArticle.imageUrl}
												style={{ width: '100%', height: '100%', objectFit: 'cover' }}
											/>
										</div>
									}
									onClick={() => history.push(`/blog/${relArticle.slug}`)}
								>
									<Title level={5} ellipsis={{ rows: 2 }}>
										{relArticle.title}
									</Title>
									<Space style={{ fontSize: '12px', color: '#8c8c8c' }}>
										<CalendarOutlined />
										<span>{moment(relArticle.createdAt).format('DD/MM/YYYY')}</span>
									</Space>
								</Card>
							</Col>
						))}
					</Row>
				</div>
			)}
		</div>
	);
};

export default ChiTiet;
