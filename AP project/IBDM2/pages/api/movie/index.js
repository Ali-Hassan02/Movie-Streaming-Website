import dbConnect from '../../../lib/mongo';  // Make sure the path is correct
import Movie from '@/models/Movie';   // Ensure the path is correct
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    await dbConnect(); // Connect to the database
 
    // Fetch all movies from the Movie collection
    const movies = await Movie.find(); // Ensure this matches the schema
   
    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found in the database' });
    }

    res.status(200).json(movies); // Return the movies as a JSON response
  } catch (error) {
    console.error('Error fetching movies:', error);  // Log the error
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
