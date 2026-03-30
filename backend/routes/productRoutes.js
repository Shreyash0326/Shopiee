import express from 'express';
import Product from '../models/Product.js';
const router = express.Router();


router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});


router.post('/', async (req, res) => {
  const { name, description, price, stock, image } = req.body;

  const product = new Product({
    name,
    description,
    price,
    stock,
    image,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
