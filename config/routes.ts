export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'TrangChu',
		component: './Blog/Home',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'GioiThieu',
		component: './Blog/About',
		icon: 'InfoCircleOutlined',
	},
	// {
	// 	path: '/random-user',
	// 	name: 'RandomUser',
	// 	component: './RandomUser',
	// 	icon: 'ArrowsAltOutlined',
	// },
	{
		path: '/blog',
		name: 'Blog',
		icon: 'ReadOutlined',
		routes: [
			{
				path: '/blog',
				exact: true,
				redirect: '/dashboard',
			},
			{
				path: '/blog/about',
				redirect: '/gioi-thieu',
			},
			{
				path: '/blog/manage/posts',
				name: 'BlogManagePosts',
				component: './Blog/ManagePosts',
			},
			{
				path: '/blog/manage/tags',
				name: 'BlogManageTags',
				component: './Blog/ManageTags',
			},
			{
				path: '/blog/:slug',
				component: './Blog/Detail',
				hideInMenu: true,
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
