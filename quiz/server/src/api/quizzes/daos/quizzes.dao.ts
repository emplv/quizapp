import { v4 as uuidv4 } from 'uuid';

import mongooseService from '../../common/services/mongoose.service';
import { PermissionFlag } from '../../common/middleware/permission.middleware';
import { QuizDto, QuizQuestionType } from '../dto/quiz.dto';
import { CreateQuizDto } from '../dto/create.quiz.dto';
import { PutQuizDto } from '../dto/put.quiz.dto';
import { PatchQuizDto } from '../dto/patch.quiz.dto';


class QuizzesDao {
    Schema = mongooseService.getMongoose().Schema;

    quizSchema = new this.Schema({
        _id: String,
        title: String,
        published: { type: Boolean, default: false },
        link: { type: String, default: "" },
        userId: String,
        questions: [new this.Schema({
            question: String,
            type: { type: String, enum: [QuizQuestionType.single, QuizQuestionType.multi] },
            answers: [String],
            answer: { type: Number, min: 1 },
        })],
        __v: { type: Number, select: false },
    }, { id: false });

    Quiz = mongooseService.getMongoose().model('Quiz', this.quizSchema);

    async addQuiz(quizFields: CreateQuizDto): Promise<QuizDto['_id']> {
        const quizId = uuidv4();
        const quiz = new this.Quiz({
            _id: quizId,
            ...quizFields,
        });
        await quiz.save();
        return quizId;
    }

    removeQuizById(quizId: string) {
        return this.Quiz.deleteOne({ _id: quizId }).exec();
    }

    getQuizById(quizId: string): Promise<QuizDto> {
        return this.Quiz.findById(quizId).exec();
    }

    getQuizByLink(link: string): Promise<QuizDto> {
        return this.Quiz.findOne({ link }).exec();
    }

    getQuizzes(userId: string, limit = 25, page = 0): Promise<QuizDto[]> {
        return this.Quiz.find({ userId }, null, { limit, skip: limit * page }).exec();
    }

    updateQuizById(quizId: string, quizFields: PatchQuizDto | PutQuizDto): Promise<QuizDto> {
        return this.Quiz.findByIdAndUpdate(
            quizId,
            { $set: quizFields },
            { new: true }
        ).exec();
    }
}

export default new QuizzesDao();
