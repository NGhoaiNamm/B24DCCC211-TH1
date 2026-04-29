import { Tag } from 'antd';
import './style.less';

interface TagPillProps {
	tag: Blog.Tag;
	active?: boolean;
	onClick?: (tag: Blog.Tag) => void;
}

const TagPill = ({ tag, active, onClick }: TagPillProps) => {
	return (
		<Tag className={`blog-tag-pill ${active ? 'active' : ''}`} onClick={() => onClick?.(tag)}>
			{tag.name}
		</Tag>
	);
};

export default TagPill;
