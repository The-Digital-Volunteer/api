import { Router } from 'express';
import UserController from './controllers/UserController';
import UserRatingController from './controllers/UserRatingController';
import MessageController from './controllers/MessageController';
import HelpRequestController from './controllers/HelpRequestController';
import auth from './policies/auth.policy';

const routes = new Router();

routes.post('/users', UserController.register);
routes.post('/users/auth', UserController.auth);

routes.use(auth);
routes.get('/users/:id/logout', UserController.logout);
routes.get('/users/:id', UserController.get);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.remove);

routes.post('/rating', UserRatingController.register);
routes.get('/user/:userId/ratings/received', UserRatingController.received);
routes.get('/user/:userId/ratings/created', UserRatingController.created);

routes.post('/message', MessageController.register);
routes.get('/message/:id', MessageController.get);
routes.delete('/message/:id', MessageController.remove);
routes.get('/user/:userId/messages/sent', MessageController.sent);
routes.get('/user/:userId/messages/received', MessageController.received);

routes.post('/help-request', HelpRequestController.register);
routes.get('/help-request/:id', HelpRequestController.get);
routes.put('/help-request/:id', HelpRequestController.update);
routes.delete('/help-request/:id', HelpRequestController.remove);

routes.post('/help-request/search/inneed', HelpRequestController.searchInNeed);
routes.post('/help-request/:id/search/helper', HelpRequestController.searchHelper);
routes.post('/help-request/:id/assign', HelpRequestController.assign);
routes.post('/help-request/:id/accept', HelpRequestController.assignAccept);
routes.post('/help-request/:id/done', HelpRequestController.markDone);

routes.all('*', (_, res) => res.status(404).send('Page Not Found'));

export default routes;
