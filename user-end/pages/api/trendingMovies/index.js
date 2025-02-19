import dbConnect from '@/lib/mongo';  // Ensure your DB connection setup
import Movie from '@/models/Movie';  // Import your Movie model

export default async function handler(req, res) {
  try {
    await dbConnect();  // Ensure DB connection is established
    // Sort by rating in descending order and limit to the first 10 movies
    const trendingMovies = await Movie.find()  
      .sort({ rating: -1 })  // Sort by rating descending (-1 for descending)
      .limit(10);  // Limit to top 10 trending movies based on rating

    if (trendingMovies.length === 0) {
      return res.status(404).json({ message: 'No trending movies found' });
    }
    res.status(200).json({ trendingMovies });
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
}
