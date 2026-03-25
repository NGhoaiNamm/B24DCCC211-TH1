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
		path: '/quan-ly-dat-lich',
		name: 'Quản lý Đặt lịch',
		icon: 'calendar',
		routes: [
			{
				path: '/quan-ly-dat-lich/nhan-vien',
				name: 'Nhân viên',
				component: './QuanLyDatLich/NhanVien',
			},
			{
				path: '/quan-ly-dat-lich/dich-vu',
				name: 'Dịch vụ',
				component: './QuanLyDatLich/DichVu',
			},
			{
				path: '/quan-ly-dat-lich/lich-hen',
				name: 'Lịch hẹn',
				component: './QuanLyDatLich/LichHen',
			},
			{
				path: '/quan-ly-dat-lich/danh-gia',
				name: 'Đánh giá',
				component: './QuanLyDatLich/DanhGia',
			},
			{
				path: '/quan-ly-dat-lich/thong-ke',
				name: 'Thống kê',
				component: './QuanLyDatLich/ThongKe',
			},
		],
	},
	// {
	// 	path: '/doan-so',
	// 	name: 'Trò Chơi',
	// 	component: './TroChoi',
	// 	icon: 'RightCircleOutlined',
	// },
	// {
	// 	path: '/todo-list',
	// 	name: 'TodoList',
	// 	component: './ToDoList',
	// 	icon: 'CheckSquareOutlined',
	// },
	// {
	// 	path: '/oan-tu-ti',
	// 	name: 'Trò chơi Oẳn Tù Tì',
	// 	icon: 'SmileOutlined',
	// 	component: './OanTuTi',
	// },
	// {
	// 	path: '/quan-ly-cau-hoi',
	// 	name: 'Ngân hàng Câu hỏi',
	// 	icon: 'DatabaseOutlined',
	// 	component: './QuestionBank',
	// },

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
