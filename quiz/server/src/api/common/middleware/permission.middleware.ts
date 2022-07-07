import express from 'express';

export enum PermissionFlag {
    PUBLIC = 1,
    ADMIN = 1<<1,
}

export function permissionFlagRequired(requiredFlag: PermissionFlag) {
    return (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (res.locals.jwt.permissionFlags & requiredFlag) {
            return next();
        }
        return res.status(403).send();
    };
}

export function selfOrAdmin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    if (
        req.params.userId === res.locals.jwt.userId
        || res.locals.jwt.permissionFlags & PermissionFlag.ADMIN
    ) {
        return next();
    }
    return res.status(403).send();
}

export function combinePermissionFlags(flags: PermissionFlag[]) {
    return flags.reduce((acc, flag) => acc | flag, 0);
}