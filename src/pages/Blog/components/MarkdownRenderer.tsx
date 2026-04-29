import { useMemo } from 'react';
import './style.less';

const escapeHtml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const renderInline = (value: string) => {
	let content = escapeHtml(value);
	content = content.replace(
		/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
		'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
	);
	content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
	content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
	return content;
};

const parseMarkdown = (markdown: string) => {
	const lines = markdown.replace(/\r/g, '').split('\n');
	const html: string[] = [];
	let inCode = false;
	let codeLang = '';
	let codeLines: string[] = [];
	let inUl = false;
	let inOl = false;

	const closeList = () => {
		if (inUl) {
			html.push('</ul>');
			inUl = false;
		}
		if (inOl) {
			html.push('</ol>');
			inOl = false;
		}
	};

	const flushCode = () => {
		if (!inCode) return;
		const className = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
		html.push(`<pre><code${className}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
		inCode = false;
		codeLang = '';
		codeLines = [];
	};

	lines.forEach((line) => {
		const trimmed = line.trim();

		if (trimmed.startsWith('```')) {
			if (!inCode) {
				closeList();
				inCode = true;
				codeLang = trimmed.slice(3).trim();
				return;
			}
			flushCode();
			return;
		}

		if (inCode) {
			codeLines.push(line);
			return;
		}

		if (!trimmed) {
			closeList();
			return;
		}

		const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch) {
			closeList();
			const level = headingMatch[1].length;
			html.push(`<h${level}>${renderInline(headingMatch[2])}</h${level}>`);
			return;
		}

		const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
		if (unorderedMatch) {
			if (inOl) {
				html.push('</ol>');
				inOl = false;
			}
			if (!inUl) {
				html.push('<ul>');
				inUl = true;
			}
			html.push(`<li>${renderInline(unorderedMatch[1])}</li>`);
			return;
		}

		const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
		if (orderedMatch) {
			if (inUl) {
				html.push('</ul>');
				inUl = false;
			}
			if (!inOl) {
				html.push('<ol>');
				inOl = true;
			}
			html.push(`<li>${renderInline(orderedMatch[1])}</li>`);
			return;
		}

		const quoteMatch = trimmed.match(/^>\s+(.+)$/);
		if (quoteMatch) {
			closeList();
			html.push(`<blockquote>${renderInline(quoteMatch[1])}</blockquote>`);
			return;
		}

		closeList();
		html.push(`<p>${renderInline(trimmed)}</p>`);
	});

	flushCode();
	closeList();
	return html.join('');
};

interface MarkdownRendererProps {
	content: string;
}

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
	const html = useMemo(() => parseMarkdown(content || ''), [content]);
	return <div className='blog-markdown' dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
