import { Express } from "express";

const routes = (app: Express) => {
    app.get('/api/user', (req, res) => {
        res.send('User page');
    })
 
};
export default routes;
