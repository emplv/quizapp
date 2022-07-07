import dotenv from 'dotenv';
const { error: envError } = dotenv.config();
if (envError) throw envError;

import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import helmet from 'helmet';

import apiRouter from './api/api.router';

/**
 * Config
 */
const app: express.Application = express()
    .use(express.json())
    .use(cors())
    .use(helmet())
    .use(expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.json(),
            winston.format.prettyPrint(),
            winston.format.colorize({ all: true })
        ),
        meta: false,
    }));

/**
 * Routing
 */
app.use('/api', apiRouter);
app.get('/*', (req: express.Request, res: express.Response) => {
    res.send('API Server');
});

/**
 * Server
 */
const port = 3010;
const server: http.Server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
