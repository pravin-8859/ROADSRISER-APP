import express from 'express';
const router = express.Router();

// Example GET route
router.get('/', (req, res) => {
  res.json({ message: '✅ User route working!' });  // 👈 ye change
});

export default router;
