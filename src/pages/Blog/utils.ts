export interface Tag {
	id: string;
	name: string;
	usageCount: number;
}

export interface Article {
	id: string;
	slug: string;
	title: string;
	summary: string;
	content: string; // Markdown
	imageUrl: string;
	tags: string[]; // Tag IDs
	status: 'Draft' | 'Published';
	views: number;
	author: {
		name: string;
		avatar: string;
	};
	createdAt: string; // ISO Date string
	updatedAt: string;
}

const STORAGE_KEYS = {
	ARTICLES: 'BLOG_ARTICLES',
	TAGS: 'BLOG_TAGS',
};

const MOCK_TAGS: Tag[] = [
	{ id: 't1', name: 'React', usageCount: 2 },
	{ id: 't2', name: 'JavaScript', usageCount: 2 },
	{ id: 't3', name: 'CSS', usageCount: 1 },
];

const MOCK_ARTICLES: Article[] = [
	{
		id: 'a1',
		slug: 'gioi-thieu-react-18',
		title: 'Giới thiệu các tính năng mới trong React 18',
		summary: 'React 18 mang đến nhiều cải tiến về performance với concurrent rendering.',
		content: `## React 18 có gì mới?

React 18 đã chính thức ra mắt với nhiều tính năng đáng chú ý:

1. **Concurrent Rendering**: Giúp React có thể tạm dừng, tiếp tục hoặc hủy bỏ một render.
2. **Automatic Batching**: Gộp nhiều state update lại thành một lần render duy nhất.
3. **Transitions**: Đánh dấu các state update không khẩn cấp.
4. **Suspense trên Server**: Hỗ trợ tốt hơn cho SSR.

### Ví dụ về Automatic Batching
\`\`\`jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React chỉ render lại 1 lần thay vì 2
}
\`\`\`
`,
		imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
		tags: ['t1', 't2'],
		status: 'Published',
		views: 120,
		author: {
			name: 'Admin',
			avatar: 'https://joeschmoe.io/api/v1/random',
		},
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 'a2',
		slug: 'huong-dan-css-grid',
		title: 'Hướng dẫn toàn tập về CSS Grid',
		summary: 'Học cách xây dựng layout phức tạp dễ dàng với CSS Grid.',
		content: `## Tại sao nên dùng CSS Grid?

CSS Grid Layout là hệ thống layout 2 chiều mạnh mẽ nhất hiện có trong CSS.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

Bạn có thể dễ dàng tạo ra những layout phức tạp mà không cần dùng float hay positioning phức tạp.
`,
		imageUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
		tags: ['t3'],
		status: 'Published',
		views: 45,
		author: {
			name: 'Admin',
			avatar: 'https://joeschmoe.io/api/v1/random',
		},
		createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
		updatedAt: new Date(Date.now() - 86400000).toISOString(),
	},
	{
		id: 'a3',
		slug: 'javascript-es2022',
		title: 'Những điểm mới trong JavaScript ES2022',
		summary: 'Cập nhật kiến thức với các tính năng mới nhất của ECMAScript 2022.',
		content: `## ES2022 có gì hot?

Một số tính năng nổi bật:
- Top-level await
- Object.hasOwn()
- Mảng bổ sung thêm method \`.at()\`
- Class Fields: Public và Private

### Ví dụ về phương thức \`.at()\`
\`\`\`javascript
const arr = [1, 2, 3, 4];
console.log(arr.at(-1)); // 4
\`\`\`
`,
		imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80',
		tags: ['t2'],
		status: 'Published',
		views: 89,
		author: {
			name: 'Admin',
			avatar: 'https://joeschmoe.io/api/v1/random',
		},
		createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
		updatedAt: new Date(Date.now() - 172800000).toISOString(),
	},
];

export const initMockData = () => {
	if (!localStorage.getItem(STORAGE_KEYS.TAGS)) {
		localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(MOCK_TAGS));
	}
	if (!localStorage.getItem(STORAGE_KEYS.ARTICLES)) {
		localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(MOCK_ARTICLES));
	}
};

export const getTags = (): Tag[] => {
	const data = localStorage.getItem(STORAGE_KEYS.TAGS);
	return data ? JSON.parse(data) : [];
};

export const saveTags = (tags: Tag[]) => {
	localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
};

export const getArticles = (): Article[] => {
	const data = localStorage.getItem(STORAGE_KEYS.ARTICLES);
	return data ? JSON.parse(data) : [];
};

export const saveArticles = (articles: Article[]) => {
	localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
};

export const incrementViewCount = (id: string) => {
	const articles = getArticles();
	const index = articles.findIndex((a) => a.id === id);
	if (index > -1) {
		articles[index].views += 1;
		saveArticles(articles);
	}
};

export const recalculateTagUsage = () => {
	const tags = getTags();
	const articles = getArticles();

	const newTags = tags.map((tag) => {
		const count = articles.filter((a) => a.tags && a.tags.includes(tag.id)).length;
		return { ...tag, usageCount: count };
	});
	saveTags(newTags);
};
