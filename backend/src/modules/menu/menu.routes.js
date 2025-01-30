import express from 'express';
import { menuController } from './menu.controller.js';

const menuRouter = express.Router();
menuRouter.get('/', menuController.getMenu);
menuRouter.get('/category/:category', menuController.getMenuProductByCategory);
menuRouter.get('/:id', menuController.getMenuProductById);
menuRouter.get('/name/:name', menuController.getMenuProductByName);
menuRouter.post('/addProduct', menuController.addProduct);
menuRouter.put('/updateProduct/:id', menuController.updateProduct);
menuRouter.delete('/deleteProduct/:id', menuController.deleteProduct);
export default menuRouter;