import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// @ts-expect-error
const jwtSecret: string = process.env.JWT_SECRET;

class AuthController {
    async generateToken(req: express.Request, res: express.Response) {
        try {
            const refreshId = req.body.userId + jwtSecret;
            const salt = crypto.createSecretKey(crypto.randomBytes(16));
            const hash = crypto
                .createHmac('sha512', salt)
                .update(refreshId)
                .digest('base64');
            req.body.refreshKey = salt.export();
            const token = jwt.sign(req.body, jwtSecret, {
                expiresIn: '10h',
            });
            return res
                .status(201)
                .send({
                    accessToken: token,
                    refreshToken: hash,
                    user: {
                        _id: req.body.userId,
                        email: req.body.email,
                        name: req.body.name,
                        permissionFlags: req.body.permissionFlags,
                    }
                });
        } catch (err) {
            console.warn('[Error] AuthController.generateToken:', err);
            return res.status(500).send();
        }
    }
}

export default new AuthController();
