export const BLOG_STORAGE_KEYS = {
	posts: 'blog_posts',
	tags: 'blog_tags',
	authorProfile: 'blog_author_profile',
} as const;

export const BLOG_PAGE_SIZE = 9;
export const BLOG_RELATED_LIMIT = 3;

export const BLOG_STATUS_OPTIONS: { label: string; value: Blog.PostStatus }[] = [
	{ label: 'Nháp', value: 'draft' },
	{ label: 'Đã đăng', value: 'published' },
];

export const BLOG_STATUS_LABEL: Record<Blog.PostStatus, string> = {
	draft: 'Nháp',
	published: 'Đã đăng',
};
