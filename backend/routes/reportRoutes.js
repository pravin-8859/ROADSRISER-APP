import express from 'express';
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Report route working!');
});

export default router;  // ✅ default export
