import { BLOG_PAGE_SIZE } from '@/services/Blog/constants';
import { Card, Col, Empty, Input, Pagination, Row, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import type useBlogModel from '@/models/blog';
import PostCard from '../components/PostCard';
import TagPill from '../components/TagPill';
import './style.less';

type BlogModelState = ReturnType<typeof useBlogModel>;

const BlogHomePage = () => {
	const {
		homePosts,
		homeTotal,
		publicPage,
		setPublicPage,
		publicKeyword,
		setPublicKeyword,
		publicTagId,
		setPublicTagId,
		tags,
		loadingHome,
		refreshMeta,
		loadHomeData,
	} = useModel('blog' as any) as BlogModelState;

	const [searchValue, setSearchValue] = useState<string>(publicKeyword);

	useEffect(() => {
		refreshMeta();
	}, [refreshMeta]);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			if (searchValue !== publicKeyword) {
				setPublicKeyword(searchValue);
				setPublicPage(1);
			}
		}, 300);
		return () => window.clearTimeout(timer);
	}, [searchValue, publicKeyword, setPublicKeyword, setPublicPage]);

	useEffect(() => {
		loadHomeData();
	}, [publicKeyword, publicTagId, publicPage, loadHomeData]);

	return (
		<div className='blog-page'>
			<Card>
				<div className='blog-header'>
					<div>
						<Typography.Title level={3} style={{ marginBottom: 0 }}>
							Blog cá nhân
						</Typography.Title>
						<Typography.Text type='secondary'>Khám phá các bài viết mới nhất</Typography.Text>
					</div>
					<Input
						allowClear
						className='blog-search-input'
						placeholder='Tìm bài viết...'
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
					/>
				</div>

				<div className='blog-tags-filter'>
					<TagPill
						tag={{ id: 'all', name: 'Tất cả', slug: 'tat-ca', createdAt: '' }}
						active={!publicTagId}
						onClick={() => {
							setPublicTagId(undefined);
							setPublicPage(1);
						}}
					/>
					{tags.map((tag) => (
						<TagPill
							key={tag.id}
							tag={tag}
							active={publicTagId === tag.id}
							onClick={() => {
								setPublicTagId(publicTagId === tag.id ? undefined : tag.id);
								setPublicPage(1);
							}}
						/>
					))}
				</div>

				<Spin spinning={loadingHome}>
					{homePosts.length ? (
						<>
							<Row gutter={[16, 16]}>
								{homePosts.map((post) => (
									<Col key={post.id} xs={24} sm={12} lg={8}>
										<PostCard
											post={post}
											activeTagId={publicTagId}
											onTagClick={(tag) => {
												setPublicTagId(publicTagId === tag.id ? undefined : tag.id);
												setPublicPage(1);
											}}
										/>
									</Col>
								))}
							</Row>

							<div style={{ marginTop: 20, textAlign: 'center' }}>
								<Pagination
									current={publicPage}
									pageSize={BLOG_PAGE_SIZE}
									total={homeTotal}
									showSizeChanger={false}
									onChange={(page) => setPublicPage(page)}
								/>
							</div>
						</>
					) : (
						<Empty description='Không có bài viết phù hợp' />
					)}
				</Spin>
			</Card>
		</div>
	);
};

export default BlogHomePage;
