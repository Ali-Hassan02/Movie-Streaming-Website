import dbConnect from '../../../lib/mongo'; // Database connection file
import User from '../../../models/user';    // Import the User model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect(); // Connect to the database
  
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ type : 'User Exist' , message: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with the hashed password
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Save the new user
      await newUser.save();

      

      // Respond with success
      return res.status(201).json({
        message: 'User created successfully',
        type : 'success' , 
        user: { id: newUser._id, username: newUser.username, email: newUser.email }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
