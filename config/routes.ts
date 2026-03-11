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

	//
	
///////////////////////////////////
    // QUẢN LÝ ĐẶT LỊCH HỆ THỐNG
    {
        path: '/booking-management',
        name: 'Quản lý Đặt lịch',
        icon: 'CalendarOutlined',
        routes: [
            {                path: '/booking-management/staff',
                redirect: '/booking-management/quan-ly-nhan-vien-va-dich-vu',
            },
            { 		path: '/booking-management/quan-ly-nhan-vien-va-dich-vu',
		name: 'Nhân viên & Dịch vụ',
		icon: 'DatabaseOutlined',
		component: './NhanVienVaDichVu',
	},
            {
                path: '/booking-management/appointments',
                name: 'Danh sách Lịch hẹn',
                component: './Booking/AppointmentList',
            },
            {
                path: '/booking-management/reviews',
                name: 'Đánh giá & Phản hồi',
                // component: './Booking/Reviews',
            },
            {
                path: '/booking-management/statistics',
                name: 'Thống kê & Báo cáo',
                component: './Booking/Statistics',
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
