declare module Blog {
	export type PostStatus = 'draft' | 'published';

	export interface AuthorProfile {
		avatar: string;
		name: string;
		bio: string;
		skills: string[];
		socials: {
			label: string;
			url: string;
		}[];
	}

	export interface Tag {
		id: string;
		name: string;
		slug: string;
		createdAt: string;
	}

	export interface TagUsage extends Tag {
		usageCount: number;
	}

	export interface Post {
		id: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		coverUrl: string;
		tagIds: string[];
		status: PostStatus;
		author: {
			name: string;
			avatar: string;
		};
		views: number;
		createdAt: string;
		updatedAt: string;
		publishedAt?: string;
	}

	export interface PostWithTags extends Post {
		tags: Tag[];
	}

	export interface PublicPostQuery {
		keyword?: string;
		tagId?: string;
		page?: number;
		pageSize?: number;
	}

	export interface ManagePostQuery {
		titleKeyword?: string;
		status?: 'all' | PostStatus;
	}

	export interface PostInput {
		title: string;
		slug: string;
		summary: string;
		content: string;
		coverUrl: string;
		tagIds: string[];
		status: PostStatus;
	}

	export interface TagInput {
		name: string;
		slug: string;
	}

	export interface PaginatedPosts {
		data: PostWithTags[];
		total: number;
		page: number;
		pageSize: number;
	}
}
