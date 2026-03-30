import express from 'express';
import Cart from '../models/Cart.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    const itemIndex = cart.items.findIndex((p) => p.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    cart = await cart.save();
  } else {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }],
    });
  }

  res.status(201).json(cart);
});
router.get('/', protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
});

router.delete('/:productId', protect, async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    cart = await cart.save();
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

export default router;
