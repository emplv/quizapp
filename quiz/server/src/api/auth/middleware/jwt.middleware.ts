import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { Jwt } from '../../common/interfaces/jwt';
import usersService from '../../users/services/users.service';

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;

export async function validRefreshBodyNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    if (!req.body?.refreshToken) {
        return res.status(400).send({ errors: ['Missing refreshToken'] });
    }
    const user = await usersService.getUserByEmailWithPassword(
        res.locals.jwt.email
    );
    const salt = crypto.createSecretKey(
        Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
        .createHmac('sha512', salt)
        .update(res.locals.jwt.userId + jwtSecret)
        .digest('base64');
    if (hash === req.body.refreshToken) {
        req.body = {
            userId: user._id,
            email: user.email,
            permissionFlags: user.permissionFlags,
        };
        return next();
    }
    return res.status(400).send({ errors: ['Invalid refreshToken'] });
}

export function validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    if (!req.headers.authorization) {
        return res.status(401).send();
    }
    try {
        const authorization = req.headers.authorization.split(' ');
        if (authorization[0] !== 'Bearer') {
            return res.status(401).send();
        }
        res.locals.jwt = jwt.verify(
            authorization[1],
            jwtSecret
        ) as Jwt;
        return next();
    } catch (err) {
        return res.status(403).send();
    }
}
