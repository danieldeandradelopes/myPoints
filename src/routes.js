import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import TransactionController from './app/controllers/TransactionController';
import AccountController from './app/controllers/AccountController';
import NotificationController from './app/controllers/NotificationController';
import CategoryController from './app/controllers/CategoryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

// USERS
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

// PROVIDERS
routes.get('/providers', ProviderController.index);

// FILES
routes.post('/files', upload.single('file'), FileController.store);

// TRANSACTIONS
routes.get('/transactions', TransactionController.index);
routes.post('/transactions', TransactionController.store);
routes.delete('/transactions/:id', TransactionController.delete);
routes.put('/transactions/:id', TransactionController.update);

// ACCOUNTS
routes.get('/accounts', AccountController.index);

// NOTIFICATIONS
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

// CATEGORY
routes.get('/category', CategoryController.index);
routes.post('/category', CategoryController.store);
// routes.delete('/category/:id', CategoryController.delete);
// routes.put('/category/:id', CategoryController.update);

export default routes;
