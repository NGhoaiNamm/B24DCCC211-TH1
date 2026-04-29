import type useBlogModel from '@/models/blog';
import { Card, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import './style.less';

type BlogModelState = ReturnType<typeof useBlogModel>;

const BlogAboutPage = () => {
	const { authorProfile, refreshMeta } = useModel('blog' as any) as BlogModelState;

	useEffect(() => {
		refreshMeta();
	}, [refreshMeta]);

	return (
		<div className='blog-page'>
			<Card>
				<div className='blog-about'>
					<img className='blog-about__avatar' src={authorProfile.avatar} alt={authorProfile.name} />
					<div>
						<Typography.Title level={3}>{authorProfile.name}</Typography.Title>
						<Typography.Paragraph type='secondary'>{authorProfile.bio}</Typography.Paragraph>

						<Typography.Title level={5}>Kỹ năng</Typography.Title>
						<div className='blog-about__skills'>
							{authorProfile.skills.map((skill) => (
								<Tag key={skill}>{skill}</Tag>
							))}
						</div>

						<Typography.Title level={5} style={{ marginTop: 16 }}>
							Mạng xã hội
						</Typography.Title>
						<div className='blog-about__socials'>
							{authorProfile.socials.map((social) => (
								<a className='not-underline' key={social.url} href={social.url} target='_blank' rel='noreferrer'>
									<Tag color='blue'>{social.label}</Tag>
								</a>
							))}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default BlogAboutPage;
