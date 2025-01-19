import dbConnect from '@/lib/mongo';// Make sure the path is correct
import Movie from '@/models/Movie'; // Ensure the path is correct

export default async function handler(req, res) {
    const { id } = req.query; // Get the movie ID from the URL parameter
    const { action } = req.body; // Get the action from the request body (AddRating or MinusRating)

    try {
        await dbConnect();
        const movie = await Movie.findById(id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        // Increment or decrement the rating based on the action
        if (action === 'AddRating') {
            movie.rating += 1; // Increment the rating by 1
        } else if (action === 'MinusRating') {
            movie.rating -= 1; // Decrement the rating by 1
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }
        // Save the updated movie
        await movie.save();
        res.status(200).json({ message: 'Rating updated', movie });
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ message: 'Failed to update rating' });
    }
}
