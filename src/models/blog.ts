import {
	createPost,
	createTag,
	deletePost,
	deleteTag,
	getAuthorProfile,
	getRelatedPublicPosts,
	getTagsWithUsage,
	increasePostViewBySlug,
	listManagePosts,
	listPublicPosts,
	updatePost,
	updateTag,
} from '@/services/Blog';
import { BLOG_PAGE_SIZE } from '@/services/Blog/constants';
import { message } from 'antd';
import { useCallback, useMemo, useState } from 'react';

const toErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof Error && error.message) return error.message;
	return fallback;
};

export default () => {
	const initialPublic = listPublicPosts({ page: 1, pageSize: BLOG_PAGE_SIZE });
	const [publicKeyword, setPublicKeyword] = useState<string>('');
	const [publicTagId, setPublicTagId] = useState<string | undefined>(undefined);
	const [publicPage, setPublicPage] = useState<number>(1);
	const [homePosts, setHomePosts] = useState<Blog.PostWithTags[]>(initialPublic.data);
	const [homeTotal, setHomeTotal] = useState<number>(initialPublic.total);

	const [tagsWithUsage, setTagsWithUsage] = useState<Blog.TagUsage[]>(getTagsWithUsage());
	const [authorProfile, setAuthorProfile] = useState<Blog.AuthorProfile>(getAuthorProfile());

	const [detailPost, setDetailPost] = useState<Blog.PostWithTags | undefined>(undefined);
	const [relatedPosts, setRelatedPosts] = useState<Blog.PostWithTags[]>([]);

	const [adminTitleKeyword, setAdminTitleKeyword] = useState<string>('');
	const [adminStatus, setAdminStatus] = useState<'all' | Blog.PostStatus>('all');
	const [managePosts, setManagePosts] = useState<Blog.PostWithTags[]>(
		listManagePosts({ titleKeyword: '', status: 'all' }),
	);

	const [loadingHome, setLoadingHome] = useState<boolean>(false);
	const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
	const [loadingAdmin, setLoadingAdmin] = useState<boolean>(false);
	const [submitting, setSubmitting] = useState<boolean>(false);

	const tags = useMemo<Blog.Tag[]>(
		() =>
			tagsWithUsage.map((item) => ({
				id: item.id,
				name: item.name,
				slug: item.slug,
				createdAt: item.createdAt,
			})),
		[tagsWithUsage],
	);

	const refreshMeta = useCallback(() => {
		setTagsWithUsage(getTagsWithUsage());
		setAuthorProfile(getAuthorProfile());
	}, []);

	const loadHomeData = useCallback(
		(params?: { keyword?: string; tagId?: string; page?: number }) => {
			const keyword = params?.keyword ?? publicKeyword;
			const tagId = params?.tagId ?? publicTagId;
			const page = params?.page ?? publicPage;
			setLoadingHome(true);
			try {
				const result = listPublicPosts({
					keyword,
					tagId,
					page,
					pageSize: BLOG_PAGE_SIZE,
				});
				setHomePosts(result.data);
				setHomeTotal(result.total);
				setPublicKeyword(keyword);
				setPublicTagId(tagId);
				setPublicPage(page);
			} finally {
				setLoadingHome(false);
			}
		},
		[publicKeyword, publicTagId, publicPage],
	);

	const loadDetailData = useCallback((slug: string) => {
		setLoadingDetail(true);
		try {
			const post = increasePostViewBySlug(slug);
			if (!post) {
				setDetailPost(undefined);
				setRelatedPosts([]);
				return;
			}
			setDetailPost(post);
			setRelatedPosts(getRelatedPublicPosts(slug));
		} finally {
			setLoadingDetail(false);
		}
	}, []);

	const loadManagePosts = useCallback(
		(params?: { titleKeyword?: string; status?: 'all' | Blog.PostStatus }) => {
			const titleKeyword = params?.titleKeyword ?? adminTitleKeyword;
			const status = params?.status ?? adminStatus;
			setLoadingAdmin(true);
			try {
				const data = listManagePosts({ titleKeyword, status });
				setManagePosts(data);
				setAdminTitleKeyword(titleKeyword);
				setAdminStatus(status);
			} finally {
				setLoadingAdmin(false);
			}
		},
		[adminTitleKeyword, adminStatus],
	);

	const createPostAction = useCallback(
		async (payload: Blog.PostInput) => {
			setSubmitting(true);
			try {
				createPost(payload);
				refreshMeta();
				loadManagePosts();
				loadHomeData({ page: 1 });
				message.success('Thêm bài viết thành công');
			} catch (error) {
				const errorMessage = toErrorMessage(error, 'Thêm bài viết thất bại');
				message.error(errorMessage);
				throw error;
			} finally {
				setSubmitting(false);
			}
		},
		[refreshMeta, loadManagePosts, loadHomeData],
	);

	const updatePostAction = useCallback(
		async (id: string, payload: Blog.PostInput) => {
			setSubmitting(true);
			try {
				updatePost(id, payload);
				refreshMeta();
				loadManagePosts();
				loadHomeData();
				message.success('Cập nhật bài viết thành công');
			} catch (error) {
				const errorMessage = toErrorMessage(error, 'Cập nhật bài viết thất bại');
				message.error(errorMessage);
				throw error;
			} finally {
				setSubmitting(false);
			}
		},
		[refreshMeta, loadManagePosts, loadHomeData],
	);

	const deletePostAction = useCallback(
		async (id: string) => {
			setSubmitting(true);
			try {
				deletePost(id);
				refreshMeta();
				loadManagePosts();
				loadHomeData();
				message.success('Xóa bài viết thành công');
			} catch (error) {
				const errorMessage = toErrorMessage(error, 'Xóa bài viết thất bại');
				message.error(errorMessage);
				throw error;
			} finally {
				setSubmitting(false);
			}
		},
		[refreshMeta, loadManagePosts, loadHomeData],
	);

	const createTagAction = useCallback(
		async (payload: Blog.TagInput) => {
			setSubmitting(true);
			try {
				createTag(payload);
				refreshMeta();
				loadHomeData();
				loadManagePosts();
				message.success('Thêm thẻ thành công');
			} catch (error) {
				const errorMessage = toErrorMessage(error, 'Thêm thẻ thất bại');
				message.error(errorMessage);
				throw error;
			} finally {
				setSubmitting(false);
			}
		},
		[refreshMeta, loadHomeData, loadManagePosts],
	);

	const updateTagAction = useCallback(
		async (id: string, payload: Blog.TagInput) => {
			setSubmitting(true);
			try {
				updateTag(id, payload);
				refreshMeta();
				loadHomeData();
				loadManagePosts();
				message.success('Cập nhật thẻ thành công');
			} catch (error) {
				const errorMessage = toErrorMessage(error, 'Cập nhật thẻ thất bại');
				message.error(errorMessage);
				throw error;
			} finally {
				setSubmitting(false);
			}
		},
		[refreshMeta, loadHomeData, loadManagePosts],
	);

	const deleteTagAction = useCallback(
		async (id: string) => {
			setSubmitting(true);
			try {
				deleteTag(id);
				refreshMeta();
				loadHomeData();
				loadManagePosts();
				message.success('Xóa thẻ thành công');
			} catch (error) {
				const errorMessage = toErrorMessage(error, 'Xóa thẻ thất bại');
				message.error(errorMessage);
				throw error;
			} finally {
				setSubmitting(false);
			}
		},
		[refreshMeta, loadHomeData, loadManagePosts],
	);

	return {
		publicKeyword,
		setPublicKeyword,
		publicTagId,
		setPublicTagId,
		publicPage,
		setPublicPage,
		homePosts,
		homeTotal,
		loadingHome,
		detailPost,
		relatedPosts,
		loadingDetail,
		tagsWithUsage,
		tags,
		authorProfile,
		adminTitleKeyword,
		setAdminTitleKeyword,
		adminStatus,
		setAdminStatus,
		managePosts,
		loadingAdmin,
		submitting,
		refreshMeta,
		loadHomeData,
		loadDetailData,
		loadManagePosts,
		createPostAction,
		updatePostAction,
		deletePostAction,
		createTagAction,
		updateTagAction,
		deleteTagAction,
	};
};
