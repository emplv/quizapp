import express from 'express';

export abstract class CommonRoutesConfig {
    router: express.Router;

    constructor(router: express.Router) {
        this.router = router;
        this.configureRoutes();
    }
    abstract configureRoutes(): express.Router;
}
