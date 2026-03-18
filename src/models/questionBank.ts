import { useState, useCallback } from 'react';

export interface Category {
	id: string;
	name: string;
}
export interface Subject {
	id: string;
	name: string;
	credits: number;
}
export interface Question {
	id: string;
	subjectId: string;
	categoryId: string;
	difficulty: string;
	content: string;
}
export interface ExamCriterion {
	categoryId: string;
	difficulty: string;
	count: number;
}
export interface ExamStructure {
	id: string;
	name: string;
	subjectId: string;
	criteria: ExamCriterion[];
}
export interface SavedExam {
	id: string;
	name: string;
	questions: Question[];
}

export default function questionBank() {
	//  khởi tạo dữ liệu từ localStorage
	const initData = (key: string, defaultData: any) => {
		const local = localStorage.getItem(key);
		return local ? JSON.parse(local) : defaultData;
	};

	const [categories, setCategories] = useState<Category[]>(() =>
		initData('categories_db', [
			{ id: 'K01', name: 'Tổng quan' },
			{ id: 'K02', name: 'Chuyên sâu' },
		]),
	);

	const [subjects, setSubjects] = useState<Subject[]>(() =>
		initData('subjects_db', [
			{ id: 'MH01', name: 'Lập trình Web', credits: 3 },
			{ id: 'MH02', name: 'Cơ sở dữ liệu', credits: 3 },
		]),
	);

	const [questions, setQuestions] = useState<Question[]>(() =>
		initData('questions_db', [
			{
				id: 'Q1',
				subjectId: 'MH01',
				categoryId: 'K01',
				difficulty: 'Dễ',
				content: 'React là gì? Kể tên các đặc điểm chính.',
			},
			{ id: 'Q2', subjectId: 'MH01', categoryId: 'K01', difficulty: 'Dễ', content: 'JSX là gì? Tại sao nên dùng JSX?' },
			{
				id: 'Q3',
				subjectId: 'MH01',
				categoryId: 'K01',
				difficulty: 'Trung bình',
				content: 'Phân biệt State và Props trong React.',
			},
			{
				id: 'Q5',
				subjectId: 'MH01',
				categoryId: 'K02',
				difficulty: 'Khó',
				content: 'Trình bày cơ chế hoạt động của Virtual DOM.',
			},
			{
				id: 'Q7',
				subjectId: 'MH01',
				categoryId: 'K02',
				difficulty: 'Rất khó',
				content: 'Kiến trúc React Fiber giải quyết vấn đề gì?',
			},
		]),
	);

	const [examStructures, setExamStructures] = useState<ExamStructure[]>(() => initData('savedExamStructures', []));
	const [savedExams, setSavedExams] = useState<SavedExam[]>(() => initData('savedExamsData', []));

	// HÀM THÊM/SỬA/XÓA DANH MỤC VÀ CÂU HỎI
	const updateCategory = useCallback((id: string, name: string) => {
		setCategories((prev) => {
			const updated = prev.map((c) => (c.id === id ? { ...c, name } : c));
			localStorage.setItem('categories_db', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const deleteCategory = useCallback((id: string) => {
		setCategories((prev) => {
			const updated = prev.filter((c) => c.id !== id);
			localStorage.setItem('categories_db', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const updateSubject = useCallback((id: string, name: string, credits: number) => {
		setSubjects((prev) => {
			const updated = prev.map((s) => (s.id === id ? { ...s, name, credits } : s));
			localStorage.setItem('subjects_db', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const deleteSubject = useCallback((id: string) => {
		setSubjects((prev) => {
			const updated = prev.filter((s) => s.id !== id);
			localStorage.setItem('subjects_db', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const updateQuestion = useCallback((id: string, updatedData: Partial<Question>) => {
		setQuestions((prev) => {
			const updated = prev.map((q) => (q.id === id ? { ...q, ...updatedData } : q));
			localStorage.setItem('questions_db', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const deleteQuestion = useCallback((id: string) => {
		setQuestions((prev) => {
			const updated = prev.filter((q) => q.id !== id);
			localStorage.setItem('questions_db', JSON.stringify(updated));
			return updated;
		});
	}, []);

	//  CÁC HÀM XỬ LÝ ĐỀ THI
	const searchQuestions = useCallback(
		(subjectId?: string, categoryId?: string, difficulty?: string) => {
			return questions.filter(
				(q) =>
					(!subjectId || q.subjectId === subjectId) &&
					(!categoryId || q.categoryId === categoryId) &&
					(!difficulty || q.difficulty === difficulty),
			);
		},
		[questions],
	);

	const generateExam = useCallback(
		(subjectId: string, criteriaList: ExamCriterion[]) => {
			let finalExamQuestions: Question[] = [];
			for (const criterion of criteriaList) {
				if (!criterion.categoryId || !criterion.difficulty || !criterion.count) continue;
				const eligibleQuestions = questions.filter(
					(q) =>
						q.subjectId === subjectId && q.categoryId === criterion.categoryId && q.difficulty === criterion.difficulty,
				);
				if (eligibleQuestions.length < criterion.count)
					throw new Error(
						`Thiếu câu hỏi: Yêu cầu ${criterion.count} câu [${criterion.difficulty}], nhưng chỉ có ${eligibleQuestions.length} câu.`,
					);
				const shuffled = [...eligibleQuestions].sort(() => 0.5 - Math.random());
				finalExamQuestions = finalExamQuestions.concat(shuffled.slice(0, criterion.count));
			}
			return finalExamQuestions;
		},
		[questions],
	);

	const saveStructure = useCallback((name: string, subjectId: string, criteria: ExamCriterion[]) => {
		const newStructure: ExamStructure = { id: Date.now().toString(), name, subjectId, criteria };
		setExamStructures((prev) => {
			const updated = [...prev, newStructure];
			localStorage.setItem('savedExamStructures', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const saveExam = useCallback((name: string, generatedQuestions: Question[]) => {
		const newExam: SavedExam = { id: Date.now().toString(), name, questions: generatedQuestions };
		setSavedExams((prev) => {
			const updated = [...prev, newExam];
			localStorage.setItem('savedExamsData', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const updateExam = useCallback((id: string, newName: string, updatedQuestions: Question[]) => {
		setSavedExams((prev) => {
			const updated = prev.map((e) => (e.id === id ? { ...e, name: newName, questions: updatedQuestions } : e));
			localStorage.setItem('savedExamsData', JSON.stringify(updated));
			return updated;
		});
	}, []);

	const deleteExam = useCallback((id: string) => {
		setSavedExams((prev) => {
			const updated = prev.filter((e) => e.id !== id);
			localStorage.setItem('savedExamsData', JSON.stringify(updated));
			return updated;
		});
	}, []);

	return {
		categories,
		subjects,
		questions,
		examStructures,
		savedExams,
		updateCategory,
		deleteCategory,
		updateSubject,
		deleteSubject,
		updateQuestion,
		deleteQuestion,
		searchQuestions,
		generateExam,
		saveStructure,
		saveExam,
		updateExam,
		deleteExam,
	};
}
