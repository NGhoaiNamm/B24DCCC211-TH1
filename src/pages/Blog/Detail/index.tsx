import { ArrowLeftOutlined, CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import type useBlogModel from '@/models/blog';
import { Button, Card, Col, Empty, Row, Spin, Typography } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel, useParams } from 'umi';
import MarkdownRenderer from '../components/MarkdownRenderer';
import PostCard from '../components/PostCard';
import TagPill from '../components/TagPill';
import './style.less';

type BlogModelState = ReturnType<typeof useBlogModel>;

const BlogDetailPage = () => {
	const { slug } = useParams<{ slug: string }>();
	const { detailPost, relatedPosts, loadingDetail, loadDetailData } = useModel('blog' as any) as BlogModelState;

	useEffect(() => {
		if (slug) loadDetailData(slug);
	}, [slug, loadDetailData]);

	return (
		<div className='blog-page'>
			<Card>
				<Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/dashboard')} style={{ marginBottom: 12 }}>
					Quay lại danh sách
				</Button>

				<Spin spinning={loadingDetail}>
					{detailPost ? (
						<div className='blog-detail'>
							<img className='blog-detail__cover' src={detailPost.coverUrl} alt={detailPost.title} />

							<Typography.Title className='blog-detail__title' level={2}>
								{detailPost.title}
							</Typography.Title>

							<div className='blog-detail__meta'>
								<span>
									<UserOutlined style={{ marginRight: 6 }} />
									{detailPost.author.name}
								</span>
								<span>
									<CalendarOutlined style={{ marginRight: 6 }} />
									{moment(detailPost.publishedAt || detailPost.createdAt).format('DD/MM/YYYY HH:mm')}
								</span>
								<span>
									<EyeOutlined style={{ marginRight: 6 }} />
									{detailPost.views} lượt xem
								</span>
							</div>

							<div className='blog-tags-filter' style={{ marginBottom: 0 }}>
								{detailPost.tags.map((tag) => (
									<TagPill key={tag.id} tag={tag} />
								))}
							</div>

							<MarkdownRenderer content={detailPost.content} />

							{relatedPosts.length ? (
								<div>
									<Typography.Title level={4}>Bài viết liên quan</Typography.Title>
									<Row gutter={[16, 16]}>
										{relatedPosts.map((post) => (
											<Col key={post.id} xs={24} sm={12} lg={8}>
												<PostCard post={post} />
											</Col>
										))}
									</Row>
								</div>
							) : null}
						</div>
					) : (
						<Empty description='Bài viết không tồn tại hoặc chưa được đăng' />
					)}
				</Spin>
			</Card>
		</div>
	);
};

export default BlogDetailPage;
