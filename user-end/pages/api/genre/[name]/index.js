import dbConnect from '../../../../lib/mongo';// Make sure the path is correct
import Movie from '@/models/Movie';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { name } = req.query; // `name` is the genre name
    
    try {
        await dbConnect();

        // Query movies where the genres array contains the specified genre name
        const movies = await Movie.find({ genres: name });

        if (movies.length === 0) {
            return res.status(404).json({ message: `No movies found for genre: ${name}` });
        }

        // Randomize the movies array
        // const randomizedMovies = movies.sort(() => Math.random() - 0.5);

        res.status(200).json({ movies: movies });
    } catch (error) {
        console.error('Error Fetching Movies:', error);
        res.status(500).json({ message: 'Failed to fetch movies' });
    }
}
