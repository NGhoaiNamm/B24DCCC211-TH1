import React from 'react';
import { connect, ConnectProps, Dispatch } from 'umi';
// Import Interface từ Model
import { TodoListState } from '@/models/todoList';
// Import Component mặc định (không có dấu ngoặc nhọn {})
import ToDoListForm from './components/ToDoListForm';

interface PageProps extends ConnectProps {
	dispatch: Dispatch;
	todoList: TodoListState;
}

const TodoListPage: React.FC<PageProps> = (props) => {
	const { dispatch, todoList } = props;

	return (
		<div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
			<ToDoListForm dispatch={dispatch} todoList={todoList} />
		</div>
	);
};

// Kết nối với Dva Store
export default connect(({ todoList }: { todoList: TodoListState }) => ({
	todoList,
}))(TodoListPage);
