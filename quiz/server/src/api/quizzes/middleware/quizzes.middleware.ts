import express from 'express';
import { QuizQuestion, QuizQuestionType } from '../dto/quiz.dto';

import quizService from '../services/quizzes.service';

export async function validateQuizExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const quiz = await quizService.readById(req.params.quizId);
    if (quiz) {
        res.locals.quiz = quiz;
        return next();
    }
    return res.status(404).send({
        errors: [`Quiz ${req.params.quizId} not found`],
    });
}

export async function validateCanPublishQuiz(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const quiz = await quizService.readById(req.params.quizId);
    if (quiz && quiz.userId === res.locals.jwt.userId) {
        if (quiz.published) {
            return res.status(400).send({
                errors: [`Quiz already published`],
            });
        }
        res.locals.quiz = quiz;
        return next();
    }
    return res.status(404).send({
        errors: [`Quiz ${req.params.quizId} not found`],
    });
}

export async function validateQuizPublished(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const quiz = await quizService.readByLink(req.params.linkId);
    if (quiz && quiz.published && quiz.link) {
        res.locals.quiz = quiz;
        return next();
    }
    return res.status(404).send({
        errors: [`Quiz ${req.params.quizId} not found`],
    });
}

function checkForQuestionsAndAnswers(questions: QuizQuestion[], errorOnMissing = true) {
    const errors = [];
    if (!questions) {
        errorOnMissing && errors.push("Quiz should have at least one question");
    } else if (questions.length < 1) {
        errors.push("Quiz should have at least one question");
    } else if (questions.length > 10) {
        errors.push("Quiz should have at most 10 question");
    } else {
        let missing = {
            question: false,
            answer: false,
            answers: false,
            type: false,
        };
        questions.forEach(({ question, answer, answers, type }: QuizQuestion) => {
            console.log({question, answer, answers, type});
            if (!missing.question && !question) {
                missing.question = true;
                errors.push("Question should not be empty");
            }
            if (!missing.type && !type) {
                missing.type = true;
                errors.push("Question should have a type");
            }
            if (!missing.type && ![QuizQuestionType.single, QuizQuestionType.multi].includes(type)) {
                missing.type = true;
                errors.push("Question type is invalid");
            }
            if (!missing.answer && !answer) {
                missing.answer = true;
                errors.push("Question should have at least one correct answer");
            }
            if (!missing.answers && (!answers || answers.length < 2)) {
                missing.answers = true;
                errors.push("Question should have at least two answer");
            }
            if (!missing.answers && !answers?.every((item) => !!item)) {
                missing.answers = true;
                errors.push("Question answers should not be empty");
            }
        });
    }
    return errors;
}

export async function validateQuestionsAndAnswers(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const errors = checkForQuestionsAndAnswers(req.body.questions);
    if (errors.length > 0) {
        return res.status(400).send({
            errors,
        });
    }
    return next();
};

export async function validateQuestionsAndAnswersOptional(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    const errors = checkForQuestionsAndAnswers(req.body.questions, false);
    if (errors.length > 0) {
        return res.status(400).send({
            errors,
        });
    }
    return next();
};

export async function extractQuizId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    req.body.id = req.params.quizId;
    return next();
}
