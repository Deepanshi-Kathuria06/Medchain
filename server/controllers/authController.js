// controllers/authController.js
const User = require('../models/User');

exports.registerOrLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields required' });
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email, password, role });
    return res.status(201).json({ message: 'User created', user });
  }

  if (user.password !== password ) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

res.status(200).json({ 
  message: 'Login successful', 
  user,
  token: generateAuthToken(user) // Add this line
});};
