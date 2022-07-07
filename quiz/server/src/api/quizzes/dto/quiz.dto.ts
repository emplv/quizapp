export enum QuizQuestionType {
    single = "single",
    multi = "multi",
}

export interface QuizQuestion {
    question: string;
    type: QuizQuestionType;
    answers: string[];
    answer: number;
}

export interface QuizDto {
    _id: string;
    title: string;
    published: boolean;
    link?: string;
    questions: QuizQuestion[];
    userId: string;
}
