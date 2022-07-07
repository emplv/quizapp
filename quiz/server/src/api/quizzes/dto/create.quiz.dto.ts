import { QuizDto } from './quiz.dto';

export interface CreateQuizDto extends 
    Omit<QuizDto, '_id' | 'userId' | 'link'> {}
