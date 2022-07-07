import { CRUD } from '../../common/interfaces/crud';
import QuizzesDao from '../daos/quizzes.dao';
import { QuizDto } from '../dto/quiz.dto';

class QuizzesService implements CRUD {
    create: typeof QuizzesDao['addQuiz'] = (resource) => {
        return QuizzesDao.addQuiz(resource);
    }

    deleteById: typeof QuizzesDao['removeQuizById'] = (id) => {
        return QuizzesDao.removeQuizById(id);
    }

    list: typeof QuizzesDao['getQuizzes'] = (limit, page) => {
        return QuizzesDao.getQuizzes(limit, page);
    }

    patchById: typeof QuizzesDao['updateQuizById'] = (id, resource) => {
        return QuizzesDao.updateQuizById(id, resource);
    }

    putById: typeof QuizzesDao['updateQuizById'] = (id, resource) => {
        return QuizzesDao.updateQuizById(id, resource);
    }

    readById: typeof QuizzesDao['getQuizById'] = (id) => {
        return QuizzesDao.getQuizById(id);
    }

    readByLink: typeof QuizzesDao['getQuizByLink'] = (link) => {
        return QuizzesDao.getQuizByLink(link);
    }

    publishQuizById = (id: string): Promise<QuizDto> => {
        const link = Math.random().toString(36).slice(-6);
        return QuizzesDao.updateQuizById(id, {
            published: true,
            link,
        });
    }
}

export default new QuizzesService();
