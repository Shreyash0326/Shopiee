import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const router = express.Router();


router.get('/orders', protect, admin, async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
});


router.put('/orders/:id/status', protect, admin, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
});


router.post('/products', protect, admin, async (req, res, next) => {
  try {
    const { name, description, price, stock, image } = req.body;
    const product = await Product.create({ name, description, price, stock, image });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});


router.post('/products/bulk', protect, admin, async (req, res, next) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      res.status(400);
      throw new Error('Invalid data format. Expected an array of products.');
    }
    const createdProducts = await Product.insertMany(products);
    res.status(201).json(createdProducts);
  } catch (error) {
    next(error);
  }
});


router.delete('/products/clear', protect, admin, async (req, res, next) => {
  try {
    await Product.deleteMany({});
    res.json({ message: 'Catalog cleared' });
  } catch (error) {
    next(error);
  }
});


router.put('/products/:id', protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.stock = req.body.stock || product.stock;
      product.image = req.body.image || product.image;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});


router.delete('/products/:id', protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
