import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/', protect, async (req, res) => {
  const { products, totalAmount, shippingAddress } = req.body;

  if (products && products.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
    });

    const createdOrder = await order.save();

    // Bulk update stock for all products and clear cart in parallel
    const bulkOps = products.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } }
      }
    }));

    await Promise.all([
      Product.bulkWrite(bulkOps),
      Cart.findOneAndDelete({ user: req.user._id })
    ]);

    // Automatic status updates
    const orderId = createdOrder._id;
    const statuses = ['Processing', 'Shipped', 'Delivered'];
    const delays = [10000, 20000, 30000]; // 10s, 20s, 30s

    statuses.forEach((status, index) => {
      setTimeout(async () => {
        try {
          await Order.findByIdAndUpdate(orderId, { orderStatus: status });
          console.log(`Order ${orderId} status updated to ${status}`);
        } catch (error) {
          console.error(`Error updating order ${orderId} status:`, error);
        }
      }, delays[index]);
    });

    res.status(201).json(createdOrder);
  }
});


router.get('/my', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('products.product');
  res.json(orders);
});

export default router;
