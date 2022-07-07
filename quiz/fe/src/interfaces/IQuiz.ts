export enum QuizQuestionType {
  single = "single",
  multi = "multi",
}

export interface IQuizQuestion {
  question: string;
  type: QuizQuestionType;
  answers: string[];
  answer: number;
}

export interface IQuiz {
  _id?: string;
  title: string;
  published: boolean;
  link?: string;
  userId?: string;
  questions: IQuizQuestion[];
}
