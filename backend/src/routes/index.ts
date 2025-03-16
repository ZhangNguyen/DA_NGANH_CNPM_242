import { Express } from "express";
const UserRouter = require("./UserRouter");
const routes = (app: Express) => {
    app.use('/api/users', UserRouter);
 
};
module.exports = routes;