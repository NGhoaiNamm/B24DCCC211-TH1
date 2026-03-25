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
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/doan-so',
		name: 'Trò Chơi',
		component: './TroChoi',
		icon: 'RightCircleOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		component: './ToDoList',
		icon: 'CheckSquareOutlined',
	},
	{
		path: '/oan-tu-ti',
		name: 'Trò chơi Oẳn Tù Tì',
		icon: 'SmileOutlined',
		component: './OanTuTi',
	},
	{
		path: '/quan-ly-cau-hoi',
		name: 'Ngân hàng Câu hỏi',
		icon: 'DatabaseOutlined',
		component: './QuestionBank',
	},
	{
		name: 'Quản lý Câu lạc bộ',
		path: '/quan-ly-cau-lac-bo',
		icon: 'TeamOutlined',
		routes: [
			{
				name: 'Câu lạc bộ',
				path: 'cau-lac-bo',
				component: './CauLacBo',
			},
			{
				name: 'Đơn đăng ký',
				path: 'don-dang-ky',
				component: './DonDangKy',
			},
			{
				name: 'Thành viên',
				path: 'thanh-vien',
				component: './ThanhVien',
			},
			{
				name: 'Báo cáo',
				path: 'bao-cao',
				component: './BaoCao',
			},
		],
	},
	{
		name: 'Quản lý văn bằng',
		path: '/van-bang',
		icon: 'SolutionOutlined',
		routes: [
			{
				name: 'Tra cứu',
				path: 'tra-cuu',
				component: './VanBang/TraCuu',
			},
			{
				name: 'Sổ văn bằng',
				path: 'so-van-bang',
				component: './VanBang/SoVanBang',
			},
			{
				name: 'Quyết định',
				path: 'quyet-dinh',
				component: './VanBang/QuyetDinh',
			},
			{
				name: 'Theo dõi văn bằng',
				path: 'thong-tin-van-bang',
				component: './VanBang/ThongTinVanBang',
			},
			{
				name: 'Cấu hình biểu mẫu',
				path: 'cau-hinh',
				component: './VanBang/CauHinh',
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
