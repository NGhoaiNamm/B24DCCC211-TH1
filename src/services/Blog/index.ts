import { BLOG_PAGE_SIZE, BLOG_RELATED_LIMIT, BLOG_STORAGE_KEYS } from './constants';

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage;

const cloneData = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const parseStorage = <T>(value: string | null, fallback: T): T => {
	if (!value) return fallback;
	try {
		return JSON.parse(value) as T;
	} catch {
		return fallback;
	}
};

const removeVietnamese = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D');

const normalizeText = (value?: string) => removeVietnamese(value?.toLowerCase().trim() || '');

const toSlug = (value: string) => {
	const normalized = normalizeText(value)
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');
	return normalized || `post-${Date.now()}`;
};

const nowIso = () => new Date().toISOString();
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const defaultAuthorProfile: Blog.AuthorProfile = {
	avatar: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
	name: 'Nguyễn Văn A',
	bio: 'Frontend Developer yêu thích xây dựng sản phẩm web tối ưu, dễ dùng và có trải nghiệm mượt.',
	skills: ['React', 'UmiJS', 'TypeScript', 'Ant Design', 'UI/UX'],
	socials: [
		{ label: 'GitHub', url: 'https://github.com/' },
		{ label: 'LinkedIn', url: 'https://www.linkedin.com/' },
		{ label: 'Facebook', url: 'https://facebook.com/' },
	],
};

const defaultTags: Blog.Tag[] = [
	{ id: 'tag-react', name: 'React', slug: 'react', createdAt: nowIso() },
	{ id: 'tag-umi', name: 'Umi', slug: 'umi', createdAt: nowIso() },
	{ id: 'tag-uiux', name: 'UI/UX', slug: 'ui-ux', createdAt: nowIso() },
	{ id: 'tag-clean-code', name: 'Clean Code', slug: 'clean-code', createdAt: nowIso() },
	{ id: 'tag-performance', name: 'Performance', slug: 'performance', createdAt: nowIso() },
];

const defaultPostTemplates: Array<{
	id: string;
	title: string;
	summary: string;
	content: string;
	coverUrl: string;
	tagIds: string[];
	status: Blog.PostStatus;
	views: number;
}> = [
	{
		id: 'post-1',
		title: 'Tối ưu hiệu năng React cho trang danh sách lớn',
		summary: 'Các kỹ thuật giảm render thừa và tăng tốc độ phản hồi cho danh sách dữ liệu lớn.',
		content:
			'# Tối ưu hiệu năng React\n\n## Vì sao cần tối ưu\n\nKhi danh sách dữ liệu lớn, render dư thừa làm UI chậm và giật.\n\n## Cách làm\n\n- Tách component nhỏ\n- Dùng memo hợp lý\n- Tránh state dư thừa\n\n```tsx\nconst Item = React.memo(({ title }) => <div>{title}</div>);\n```\n\n[Đọc thêm React Docs](https://react.dev/)',
		coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-react', 'tag-performance'],
		status: 'published',
		views: 24,
	},
	{
		id: 'post-2',
		title: 'Tổ chức dự án Umi rõ ràng theo domain',
		summary: 'Kinh nghiệm tách services, models, pages để dễ mở rộng và tránh xung đột logic.',
		content:
			'# Tổ chức dự án Umi\n\n## Nguyên tắc\n\n1. Domain rõ ràng\n2. Tách service và UI\n3. Tránh logic trùng lặp\n\nNội dung đầy đủ giúp team maintain lâu dài.',
		coverUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-umi', 'tag-clean-code'],
		status: 'published',
		views: 17,
	},
	{
		id: 'post-3',
		title: 'Checklist UI để sản phẩm nhìn chuyên nghiệp',
		summary: 'Spacing, typography, màu sắc và hierarchy là nền tảng cho UI production.',
		content:
			'# Checklist UI\n\n- Nhất quán spacing\n- Typography rõ cấp độ\n- Trạng thái tương tác rõ ràng\n- Nội dung dễ quét\n\nKhi các phần này đồng bộ, UI sẽ nhìn trưởng thành hơn.',
		coverUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-uiux'],
		status: 'published',
		views: 9,
	},
	{
		id: 'post-4',
		title: 'State management trong Umi: tránh xung đột dữ liệu',
		summary: 'Chiến lược tách state giữa public và admin để luồng dữ liệu luôn rõ ràng.',
		content:
			'# State management trong Umi\n\nTách state theo ngữ cảnh giúp giảm bug và tránh ghi đè dữ liệu ngoài ý muốn.',
		coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-umi', 'tag-clean-code'],
		status: 'published',
		views: 12,
	},
	{
		id: 'post-5',
		title: 'Thiết kế card list dễ quét nội dung',
		summary: 'Cách chọn thông tin hiển thị trên card để người dùng nắm ý nhanh nhất.',
		content:
			'# Thiết kế card list\n\n## Trọng tâm\n\n- Tiêu đề rõ nghĩa\n- Summary ngắn\n- Metadata vừa đủ\n- Tag hữu ích cho lọc',
		coverUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-uiux', 'tag-react'],
		status: 'published',
		views: 6,
	},
	{
		id: 'post-6',
		title: 'Tối ưu trải nghiệm tìm kiếm với debounce',
		summary: 'Debounce 300ms giúp cân bằng phản hồi UI và chi phí xử lý lọc dữ liệu.',
		content:
			'# Debounce trong tìm kiếm\n\nDebounce giúp tránh xử lý quá nhiều lần khi người dùng gõ nhanh.',
		coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-performance', 'tag-react'],
		status: 'published',
		views: 10,
	},
	{
		id: 'post-7',
		title: 'Viết markdown rõ ràng cho bài kỹ thuật',
		summary: 'Một số quy tắc viết markdown giúp bài đọc mạch lạc và dễ bảo trì.',
		content:
			'# Markdown cho bài kỹ thuật\n\n## Mẹo nhanh\n\n1. Heading rõ cấp\n2. Danh sách ngắn gọn\n3. Code block có ngữ cảnh',
		coverUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-clean-code'],
		status: 'published',
		views: 4,
	},
	{
		id: 'post-8',
		title: 'Quy trình kiểm soát chất lượng UI trước khi release',
		summary: 'Checklist thực tế để tránh lỗi hiển thị ở các breakpoint khác nhau.',
		content:
			'# Kiểm soát chất lượng UI\n\nĐo kiểm spacing, typography, hover, focus, empty state và loading state.',
		coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-uiux', 'tag-performance'],
		status: 'published',
		views: 8,
	},
	{
		id: 'post-9',
		title: 'Tổ chức dữ liệu localStorage an toàn',
		summary: 'Parse fallback, seed dữ liệu và cập nhật từng phần để tránh vỡ dữ liệu người dùng.',
		content:
			'# localStorage an toàn\n\nNên có parser fallback và schema ổn định để tránh lỗi runtime.',
		coverUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-umi', 'tag-performance'],
		status: 'published',
		views: 15,
	},
	{
		id: 'post-10',
		title: 'Cách tạo bài viết liên quan đúng ngữ cảnh',
		summary: 'Dùng giao cắt tag để đề xuất bài liên quan và giữ người dùng đọc tiếp.',
		content:
			'# Bài viết liên quan\n\nSo khớp tag và loại trừ bài hiện tại là tiêu chí đơn giản nhưng hiệu quả.',
		coverUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-react', 'tag-umi'],
		status: 'published',
		views: 13,
	},
	{
		id: 'post-11',
		title: 'Kinh nghiệm viết form thêm sửa bài viết gọn gàng',
		summary: 'Một modal form dùng chung cho create/update giúp giảm trùng lặp code.',
		content:
			'# Form thêm sửa\n\nTách form thành component độc lập để tái sử dụng và test dễ hơn.',
		coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-clean-code', 'tag-react'],
		status: 'published',
		views: 5,
	},
	{
		id: 'post-12',
		title: 'Bản nháp: Kế hoạch nội dung tháng tới',
		summary: 'Ghi chú ý tưởng chủ đề sẽ triển khai trong tháng tới.',
		content: '# Bản nháp\n\nNội dung đang được hoàn thiện.',
		coverUrl: 'https://images.unsplash.com/photo-1487015307662-8857eac2d99b?auto=format&fit=crop&w=1200&q=80',
		tagIds: ['tag-umi', 'tag-uiux'],
		status: 'draft',
		views: 0,
	},
];

const defaultPosts: Blog.Post[] = defaultPostTemplates.map((item, index) => {
	const timestamp = new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString();
	return {
		id: item.id,
		title: item.title,
		slug: toSlug(item.title),
		summary: item.summary,
		content: item.content,
		coverUrl: item.coverUrl,
		tagIds: item.tagIds,
		status: item.status,
		author: {
			name: defaultAuthorProfile.name,
			avatar: defaultAuthorProfile.avatar,
		},
		views: item.views,
		createdAt: timestamp,
		updatedAt: timestamp,
		publishedAt: item.status === 'published' ? timestamp : undefined,
	};
});

const readPosts = (): Blog.Post[] => {
	if (!canUseStorage()) return cloneData(defaultPosts);
	return parseStorage<Blog.Post[]>(window.localStorage.getItem(BLOG_STORAGE_KEYS.posts), cloneData(defaultPosts));
};

const readTags = (): Blog.Tag[] => {
	if (!canUseStorage()) return cloneData(defaultTags);
	return parseStorage<Blog.Tag[]>(window.localStorage.getItem(BLOG_STORAGE_KEYS.tags), cloneData(defaultTags));
};

const readAuthorProfile = (): Blog.AuthorProfile => {
	if (!canUseStorage()) return cloneData(defaultAuthorProfile);
	return parseStorage<Blog.AuthorProfile>(
		window.localStorage.getItem(BLOG_STORAGE_KEYS.authorProfile),
		cloneData(defaultAuthorProfile),
	);
};

const writePosts = (posts: Blog.Post[]) => {
	if (!canUseStorage()) return;
	window.localStorage.setItem(BLOG_STORAGE_KEYS.posts, JSON.stringify(posts));
};

const writeTags = (tags: Blog.Tag[]) => {
	if (!canUseStorage()) return;
	window.localStorage.setItem(BLOG_STORAGE_KEYS.tags, JSON.stringify(tags));
};

const writeAuthorProfile = (profile: Blog.AuthorProfile) => {
	if (!canUseStorage()) return;
	window.localStorage.setItem(BLOG_STORAGE_KEYS.authorProfile, JSON.stringify(profile));
};

export const seedBlogStorage = () => {
	if (!canUseStorage()) return;
	const posts = parseStorage<Blog.Post[]>(window.localStorage.getItem(BLOG_STORAGE_KEYS.posts), []);
	const tags = parseStorage<Blog.Tag[]>(window.localStorage.getItem(BLOG_STORAGE_KEYS.tags), []);
	const profile = parseStorage<Blog.AuthorProfile | null>(
		window.localStorage.getItem(BLOG_STORAGE_KEYS.authorProfile),
		null,
	);
	if (!posts.length) {
		writePosts(cloneData(defaultPosts));
	} else {
		const mergedPosts = [...posts];
		let changedPosts = false;
		defaultPosts.forEach((defaultPost) => {
			if (!mergedPosts.some((item) => item.id === defaultPost.id)) {
				mergedPosts.push(defaultPost);
				changedPosts = true;
			}
		});
		if (changedPosts) writePosts(mergedPosts);
	}
	if (!tags.length) {
		writeTags(cloneData(defaultTags));
	} else {
		const mergedTags = [...tags];
		let changedTags = false;
		defaultTags.forEach((defaultTag) => {
			if (!mergedTags.some((item) => item.id === defaultTag.id)) {
				mergedTags.push(defaultTag);
				changedTags = true;
			}
		});
		if (changedTags) writeTags(mergedTags);
	}
	if (!profile) writeAuthorProfile(cloneData(defaultAuthorProfile));
};

const joinTags = (post: Blog.Post, tags: Blog.Tag[]): Blog.PostWithTags => ({
	...post,
	tags: tags.filter((tag) => post.tagIds.includes(tag.id)),
});

const sortByPublishedDesc = (data: Blog.Post[]) =>
	[...data].sort((a, b) => {
		const aTime = new Date(a.publishedAt || a.createdAt).getTime();
		const bTime = new Date(b.publishedAt || b.createdAt).getTime();
		return bTime - aTime;
	});

const ensurePostInput = (payload: Blog.PostInput, currentId?: string) => {
	const title = payload.title?.trim();
	const summary = payload.summary?.trim();
	const content = payload.content?.trim();
	const coverUrl = payload.coverUrl?.trim();
	if (!title || !summary || !content || !coverUrl) {
		throw new Error('Vui lòng nhập đầy đủ thông tin bài viết');
	}

	const slug = toSlug(payload.slug || title);
	const posts = readPosts();
	const duplicated = posts.find((item) => item.slug === slug && item.id !== currentId);
	if (duplicated) {
		throw new Error('Slug đã tồn tại, vui lòng chọn slug khác');
	}
};

const ensureTagInput = (payload: Blog.TagInput, currentId?: string) => {
	const name = payload.name?.trim();
	if (!name) {
		throw new Error('Tên thẻ không được để trống');
	}
	const slug = toSlug(payload.slug || name);
	const tags = readTags();
	const duplicated = tags.find((item) => item.slug === slug && item.id !== currentId);
	if (duplicated) {
		throw new Error('Slug thẻ đã tồn tại');
	}
};

export const getAuthorProfile = (): Blog.AuthorProfile => {
	seedBlogStorage();
	return readAuthorProfile();
};

export const getTags = (): Blog.Tag[] => {
	seedBlogStorage();
	return readTags().sort((a, b) => a.name.localeCompare(b.name, 'vi'));
};

export const getTagsWithUsage = (): Blog.TagUsage[] => {
	seedBlogStorage();
	const tags = getTags();
	const posts = readPosts();
	return tags.map((tag) => ({
		...tag,
		usageCount: posts.filter((post) => post.tagIds.includes(tag.id)).length,
	}));
};

export const listPublicPosts = (params?: Blog.PublicPostQuery): Blog.PaginatedPosts => {
	seedBlogStorage();
	const keyword = normalizeText(params?.keyword);
	const tagId = params?.tagId;
	const page = Math.max(1, Number(params?.page || 1));
	const pageSize = Math.max(1, Number(params?.pageSize || BLOG_PAGE_SIZE));
	const tags = getTags();
	const publishedPosts = sortByPublishedDesc(readPosts().filter((post) => post.status === 'published'));
	const filtered = publishedPosts.filter((post) => {
		if (tagId && !post.tagIds.includes(tagId)) return false;
		if (!keyword) return true;
		const tagText = tags
			.filter((tag) => post.tagIds.includes(tag.id))
			.map((tag) => tag.name)
			.join(' ');
		const searchable = normalizeText([post.title, post.summary, post.content, tagText].join(' '));
		return searchable.includes(keyword);
	});
	const total = filtered.length;
	const startIndex = (page - 1) * pageSize;
	const paginated = filtered.slice(startIndex, startIndex + pageSize).map((post) => joinTags(post, tags));
	return {
		data: paginated,
		total,
		page,
		pageSize,
	};
};

export const getPublicPostBySlug = (slug: string): Blog.PostWithTags | null => {
	seedBlogStorage();
	const tags = getTags();
	const post = readPosts().find((item) => item.slug === slug && item.status === 'published');
	if (!post) return null;
	return joinTags(post, tags);
};

export const increasePostViewBySlug = (slug: string): Blog.PostWithTags | null => {
	seedBlogStorage();
	const tags = getTags();
	const posts = readPosts();
	const index = posts.findIndex((item) => item.slug === slug && item.status === 'published');
	if (index < 0) return null;
	const updated: Blog.Post = {
		...posts[index],
		views: Number(posts[index].views || 0) + 1,
		updatedAt: nowIso(),
	};
	posts[index] = updated;
	writePosts(posts);
	return joinTags(updated, tags);
};

export const getRelatedPublicPosts = (slug: string, limit: number = BLOG_RELATED_LIMIT): Blog.PostWithTags[] => {
	seedBlogStorage();
	const current = getPublicPostBySlug(slug);
	if (!current) return [];
	const tags = getTags();
	const related = sortByPublishedDesc(
		readPosts().filter(
			(item) =>
				item.status === 'published' &&
				item.slug !== slug &&
				item.tagIds.some((tagId) => current.tagIds.includes(tagId)),
		),
	)
		.slice(0, limit)
		.map((post) => joinTags(post, tags));
	return related;
};

export const listManagePosts = (params?: Blog.ManagePostQuery): Blog.PostWithTags[] => {
	seedBlogStorage();
	const titleKeyword = normalizeText(params?.titleKeyword);
	const status = params?.status || 'all';
	const tags = getTags();
	const filtered = sortByPublishedDesc(readPosts()).filter((post) => {
		if (status !== 'all' && post.status !== status) return false;
		if (!titleKeyword) return true;
		return normalizeText(post.title).includes(titleKeyword);
	});
	return filtered.map((post) => joinTags(post, tags));
};

export const createPost = (payload: Blog.PostInput): Blog.Post => {
	seedBlogStorage();
	ensurePostInput(payload);
	const profile = getAuthorProfile();
	const posts = readPosts();
	const tags = getTags();
	const tagIds = payload.tagIds.filter((tagId) => tags.some((tag) => tag.id === tagId));
	const createdAt = nowIso();
	const post: Blog.Post = {
		id: createId(),
		title: payload.title.trim(),
		slug: toSlug(payload.slug || payload.title),
		summary: payload.summary.trim(),
		content: payload.content.trim(),
		coverUrl: payload.coverUrl.trim(),
		tagIds,
		status: payload.status,
		author: {
			name: profile.name,
			avatar: profile.avatar,
		},
		views: 0,
		createdAt,
		updatedAt: createdAt,
		publishedAt: payload.status === 'published' ? createdAt : undefined,
	};
	writePosts([post, ...posts]);
	return post;
};

export const updatePost = (id: string, payload: Blog.PostInput): Blog.Post => {
	seedBlogStorage();
	ensurePostInput(payload, id);
	const posts = readPosts();
	const tags = getTags();
	const index = posts.findIndex((item) => item.id === id);
	if (index < 0) throw new Error('Không tìm thấy bài viết');
	const current = posts[index];
	const nextStatus = payload.status;
	const nextPublishedAt = nextStatus === 'published' ? current.publishedAt || nowIso() : undefined;
	const updated: Blog.Post = {
		...current,
		title: payload.title.trim(),
		slug: toSlug(payload.slug || payload.title),
		summary: payload.summary.trim(),
		content: payload.content.trim(),
		coverUrl: payload.coverUrl.trim(),
		tagIds: payload.tagIds.filter((tagId) => tags.some((tag) => tag.id === tagId)),
		status: nextStatus,
		publishedAt: nextPublishedAt,
		updatedAt: nowIso(),
	};
	posts[index] = updated;
	writePosts(posts);
	return updated;
};

export const deletePost = (id: string): void => {
	seedBlogStorage();
	const posts = readPosts();
	const nextPosts = posts.filter((item) => item.id !== id);
	if (nextPosts.length === posts.length) {
		throw new Error('Không tìm thấy bài viết để xóa');
	}
	writePosts(nextPosts);
};

export const createTag = (payload: Blog.TagInput): Blog.Tag => {
	seedBlogStorage();
	ensureTagInput(payload);
	const tag: Blog.Tag = {
		id: createId(),
		name: payload.name.trim(),
		slug: toSlug(payload.slug || payload.name),
		createdAt: nowIso(),
	};
	const tags = readTags();
	writeTags([tag, ...tags]);
	return tag;
};

export const updateTag = (id: string, payload: Blog.TagInput): Blog.Tag => {
	seedBlogStorage();
	ensureTagInput(payload, id);
	const tags = readTags();
	const index = tags.findIndex((item) => item.id === id);
	if (index < 0) throw new Error('Không tìm thấy thẻ');
	const updated: Blog.Tag = {
		...tags[index],
		name: payload.name.trim(),
		slug: toSlug(payload.slug || payload.name),
	};
	tags[index] = updated;
	writeTags(tags);
	return updated;
};

export const deleteTag = (id: string): void => {
	seedBlogStorage();
	const tags = readTags();
	const nextTags = tags.filter((item) => item.id !== id);
	if (nextTags.length === tags.length) throw new Error('Không tìm thấy thẻ để xóa');
	writeTags(nextTags);
	const posts = readPosts().map((post) => ({
		...post,
		tagIds: post.tagIds.filter((tagId) => tagId !== id),
		updatedAt: nowIso(),
	}));
	writePosts(posts);
};

export const updateAuthorProfile = (payload: Blog.AuthorProfile): Blog.AuthorProfile => {
	seedBlogStorage();
	const profile: Blog.AuthorProfile = {
		avatar: payload.avatar?.trim() || defaultAuthorProfile.avatar,
		name: payload.name?.trim() || defaultAuthorProfile.name,
		bio: payload.bio?.trim() || defaultAuthorProfile.bio,
		skills: payload.skills || [],
		socials: payload.socials || [],
	};
	writeAuthorProfile(profile);
	return profile;
};
