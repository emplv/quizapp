import express from 'express';

import quizzesService from '../services/quizzes.service';

class QuizzesController {
    async listQuizzes(req: express.Request, res: express.Response) {
        const userId = res.locals.jwt.userId;
        const quizzes = await quizzesService.list(userId, 100, 0);
        return res.status(200).send(quizzes);
    }

    async getQuizById(req: express.Request, res: express.Response) {
        const quiz = await quizzesService.readById(req.body.id);
        if (!quiz.published && quiz.userId !== res.locals.jwt.userId) {
            return res.status(403).send();
        }
        return res.status(200).send(quiz);
    }
    
    async getQuizByLink(req: express.Request, res: express.Response) {
        const quiz = await quizzesService.readByLink(req.params.linkId);
        if (!quiz || !quiz.published) {
            return res.status(403).send();
        }
        return res.status(200).send(quiz);
    }

    async createQuiz(req: express.Request, res: express.Response) {
        const quizId = await quizzesService.create({
            ...req.body,
            userId: res.locals.jwt.userId,
            published: false,
        });
        return res.status(201).send({ id: quizId });
    }

    async patch(req: express.Request, res: express.Response) {
        await quizzesService.patchById(req.body.id, req.body);
        return res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        await quizzesService.putById(req.body.id, req.body);
        return res.status(204).send();
    }

    async removeQuiz(req: express.Request, res: express.Response) {
        await quizzesService.deleteById(req.body.id);
        return res.status(204).send();
    }

    async publishQuiz(req: express.Request, res: express.Response) {
        const quiz = await quizzesService.publishQuizById(req.body.id);
        if (!quiz.published || !quiz.link) {
            return res.status(400).send();
        }
        return res.status(201).send({ link: quiz.link });
    }
}

export default new QuizzesController();
