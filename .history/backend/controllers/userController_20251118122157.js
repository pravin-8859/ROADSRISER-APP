import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if(userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
}
export default User;
