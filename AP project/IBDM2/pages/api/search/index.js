import dbConnect from '@/lib/mongo'; // Ensure your db connection setup
import Movie from '@/models/Movie';  // Import your Movie model

export default async function handler(req, res) {
  const { query } = req.query;  // Get the search query from the request

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    await dbConnect();  // Ensure DB is connected
    // Perform the full-text search
    const movies = await Movie.find({
      $text: { $search: query },  // Perform text search on the indexed fields
    });

    if (movies.length === 0) {
      return res.status(404).json({ message: 'No movies found' });
    }
    res.status(200).json({ movies });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
}
