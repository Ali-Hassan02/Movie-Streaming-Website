import dbConnect from '../../../lib/mongo';
import User from '../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { email, password } = req.body;
    
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ type: 'email', message: 'Email does not exist' });
      }

      // Check if password matches
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        return res.status(401).json({ type: 'password', message: 'Incorrect Password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username }, // Use correct fields
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      // Set the token as an HttpOnly cookie
      res.setHeader(
        'Set-Cookie',
        `token=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax`
      );

      // Respond with success, user details, and token
      return res.status(200).json({ 
        type: 'success', 
        user: { id: user._id, username: user.username, email: user.email },
        token // Add token here
      });
    } catch (err) {
      console.error("Error authenticating user:", err);
      return res.status(500).json({ message: "Some error occurred" });
    }
  } else {
    // Handle other HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
