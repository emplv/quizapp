import express from 'express';
import { body } from 'express-validator';

import { CommonRoutesConfig } from '../common/common.routes';
import QuizzesController from './controllers/quizzes.controller';
import {
    extractQuizId,
    validateCanPublishQuiz,
    validateQuizPublished,
    validateQuestionsAndAnswers,
    validateQuestionsAndAnswersOptional,
} from './middleware/quizzes.middleware';
import { validJWTNeeded } from '../auth/middleware/jwt.middleware';
import { verifyBodyValidationErrors } from '../common/middleware/verifyBodyValidationErrors.middleware';


export class QuizzesRoutes extends CommonRoutesConfig {
    constructor(router: express.Router) {
        super(router);
    }

    configureRoutes(): express.Router {
        this.router
            .route(`/quizzes`)
            .get(
                validJWTNeeded,
                QuizzesController.listQuizzes
            )
            .post(
                validJWTNeeded,
                body('title')
                    .isString()
                    .isLength({ min: 3 })
                    .withMessage('Title must be at least 3 characters'),
                verifyBodyValidationErrors,
                validateQuestionsAndAnswers,
                QuizzesController.createQuiz
            );

        this.router.param(`quizId`, extractQuizId);

        this.router
            .route(`/quizzes/publish/:quizId`)
            .get(
                validJWTNeeded,
                validateCanPublishQuiz,
                QuizzesController.publishQuiz,
            );

        this.router
            .route(`/quizzes/link/:linkId`)
            .get(
                validateQuizPublished,
                QuizzesController.getQuizByLink,
            );

        this.router
            .route(`/quizzes/:quizId`)
            .all(
                validJWTNeeded,
                validateQuizPublished,
            )
            .get(QuizzesController.getQuizById)
            .put([
                body('title')
                    .isString()
                    .isLength({ min: 3 })
                    .withMessage('Title must be at least 3 characters'),
                verifyBodyValidationErrors,
                validateQuestionsAndAnswers,
                QuizzesController.put,
            ])
            .patch([
                body('title')
                    .isString()
                    .isLength({ min: 3 })
                    .withMessage('Title must be at least 3 characters')
                    .optional(),
                verifyBodyValidationErrors,
                validateQuestionsAndAnswersOptional,
                QuizzesController.patch,
            ])
            .delete(QuizzesController.removeQuiz);

        return this.router;
    }
}
