import dbConnect from '../../../../lib/mongo'; // Ensure the path is correct
import Movie from '../../../../models/Movie'; // Ensure the path is correct
import Director from '@/models/Director';
import Producer from '@/models/Producer';
import Actor from '@/models/Actor';
export default async function handler(req, res) {
    const { id } = req.query; // Get the movie ID from the URL parameter

    try {
        await dbConnect(); // Ensure DB connection is established

        if (req.method === 'DELETE') {
            // Delete the movie by its ID
            const deletedMovie = await Movie.deleteOne({ _id: id });

            if (deletedMovie.deletedCount === 0) {
                return res.status(404).json({ message: `Movie with id ${id} not found` });
            }

            return res.status(200).json({ message: `Movie with id ${id} has been deleted successfully` });
        } else if (req.method === 'GET') {
            // Fetch the movie by its ID
            const movie = await Movie.findById(id);

            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            const directors = await Director.find();
            const producers = await Producer.find();
            const actors = await Actor.find();

            const actor_arr = movie.actors.flatMap((a) => {
                return actors.filter((x) => {
                     
                    return x._id.toString() === a.toString();
                });
            });


            const director_arr = movie.directors.flatMap((d) => {
                return directors.filter((x) => {
                     
                    return x._id.toString() === d.toString();
                });
            });

            const producer_arr = movie.producers.flatMap((p) => {
                return producers.filter((x) => x._id.toString() === p.toString());
            });
            
            const modifiedMovie = {
                ...movie.toObject(),  // Convert movie to a plain object to avoid any MongoDB document methods
                actors : actor_arr , 
                directors: director_arr,
                producers: producer_arr 
            };
            
            
            return res.status(200).json({ movie : modifiedMovie });

        } else {
            // If the method is not DELETE or GET, return 405
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error('Error handling movie:', error);
        return res.status(500).json({ message: 'Server error while handling movie' });
    }
}
