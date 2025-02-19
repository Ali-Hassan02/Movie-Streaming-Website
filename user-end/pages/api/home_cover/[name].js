import dbConnect from '@/lib/mongo'; // Ensure the path is correct
import Movie from '@/models/Movie'; // Ensure the path is correct

export default async function handler(req, res) {
    const { name } = req.query; // Get the movie ID from the URL parameter
    
    try {
        await dbConnect(); // Ensure DB connection is established

        if (req.method === 'GET') {
            // Fetch the movie by its ID
            const movie = await Movie.findOne({title : name});

            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            return res.status(200).json({ movie });
        } else {
            // If the method is not DELETE or GET, return 405
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error handling movie:', error);
        return res.status(500).json({ message: 'Server error while handling movie' });
    }
}
