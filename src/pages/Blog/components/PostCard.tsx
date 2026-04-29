import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import moment from 'moment';
import { Link } from 'umi';
import TagPill from './TagPill';
import './style.less';

interface PostCardProps {
	post: Blog.PostWithTags;
	activeTagId?: string;
	onTagClick?: (tag: Blog.Tag) => void;
}

const PostCard = ({ post, activeTagId, onTagClick }: PostCardProps) => {
	return (
		<Card
			hoverable
			className='blog-post-card'
			cover={
				<Link to={`/blog/${post.slug}`}>
					<img className='blog-post-card__cover' src={post.coverUrl} alt={post.title} />
				</Link>
			}
		>
			<Link className='blog-post-card__title not-underline' to={`/blog/${post.slug}`}>
				{post.title}
			</Link>

			<Typography.Paragraph ellipsis={{ rows: 3 }} type='secondary' style={{ marginBottom: 0 }}>
				{post.summary}
			</Typography.Paragraph>

			<div className='blog-post-card__meta'>
				<span className='blog-post-card__meta-item'>
					<UserOutlined />
					{post.author.name}
				</span>
				<span className='blog-post-card__meta-item'>
					<CalendarOutlined />
					{moment(post.publishedAt || post.createdAt).format('DD/MM/YYYY')}
				</span>
				<span className='blog-post-card__meta-item'>
					<EyeOutlined />
					{post.views}
				</span>
			</div>

			<div className='blog-post-card__tags'>
				{post.tags.map((tag) => (
					<TagPill key={tag.id} tag={tag} active={activeTagId === tag.id} onClick={onTagClick} />
				))}
			</div>
		</Card>
	);
};

export default PostCard;
