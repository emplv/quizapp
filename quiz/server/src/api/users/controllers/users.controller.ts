import express from 'express';
import argon2 from 'argon2';

import usersService from '../services/users.service';
import { PermissionFlag } from '../../common/middleware/permission.middleware';

class UsersController {
    async listUsers(req: express.Request, res: express.Response) {
        const users = await usersService.list(100, 0);
        return res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await usersService.readById(req.body.id);
        return res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const userId = await usersService.create({
            ...req.body,
            permissionFlags: PermissionFlag.PUBLIC,
        });
        return res.status(201).send({ id: userId });
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        await usersService.patchById(req.body.id, req.body);
        return res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        await usersService.putById(req.body.id, req.body);
        return res.status(204).send();
    }

    async removeUser(req: express.Request, res: express.Response) {
        await usersService.deleteById(req.body.id);
        return res.status(204).send();
    }

    async listPermissionFlags(req: express.Request, res: express.Response) {
        return res.status(200).send(Object.entries(PermissionFlag));
    }

    // Only for demo purpose, to create inital admin user
    async addAdmin(req: express.Request, res: express.Response) {
        const userId = await usersService.addAdmin();
        return res.status(201).send({ id: userId });
    }
}

export default new UsersController();
