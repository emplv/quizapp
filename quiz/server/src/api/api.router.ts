import express from 'express';

import { AuthRoutes } from './auth/auth.routes';
import { UsersRoutes } from './users/users.routes';
import { QuizzesRoutes } from './quizzes/quizzes.routes';

const router = express.Router();

new AuthRoutes(router);
new UsersRoutes(router);
new QuizzesRoutes(router);

export default router;