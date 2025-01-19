// pages/api/test-connection.js
import dbConnect from '../../lib/mongo';

export default async function handler(req, res) {
  try {
    // Attempt to connect to MongoDB
    console.log('I AM IN TEST')
    await dbConnect();
    res.status(200).json({ message: 'Successfully connected to MongoDB!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to connect to MongoDB', error: error.message });
  }
}



