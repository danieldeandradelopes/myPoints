import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import TransactionController from './app/controllers/TransactionController';
import AccountController from './app/controllers/AccountController';
import GridController from './app/controllers/GridController';
import ProductsController from './app/controllers/ProductsController';
import PicturesProductsController from './app/controllers/PicturesProductsController';

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

routes.post(
  '/pictures',
  upload.single('file'),
  PicturesProductsController.store
);

// TRANSACTIONS
routes.get('/transactions', TransactionController.index);
routes.post('/transactions', TransactionController.store);
routes.delete('/transactions/:id', TransactionController.delete);
routes.put('/transactions/:id', TransactionController.update);

// ACCOUNTS
routes.get('/accounts', AccountController.index);

// GRID
routes.get('/grid', GridController.index);
routes.post('/grid', GridController.store);
routes.put('/grid/:id', GridController.update);
routes.delete('/grid/:id', GridController.delete);

// PRODUCT
routes.get('/products', ProductsController.index);
routes.post('/products', ProductsController.store);
routes.put('/products/:id', ProductsController.update);
routes.delete('/products/:id', ProductsController.delete);

export default routes;
