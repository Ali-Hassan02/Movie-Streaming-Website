import dbConnect from '@/lib/mongo';  // Ensure your DB connection setup
import Movie from '@/models/Movie';  // Import your Movie model

export default async function handler(req, res) {
  try {
    await dbConnect();  // Ensure DB connection is established
    // Sort by releaseDate in descending order and limit to first 10 movies
    const movies = await Movie.find()  
      .sort({ releaseDate: -1 })  // Sort by releaseDate descending (-1 for descending and 1 for ascending)
      .limit(10);  // Limit to first 5 movies that are released recently
    
    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found' });
    }
    res.status(200).json({ movies });
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
}
