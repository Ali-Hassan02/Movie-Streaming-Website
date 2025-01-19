import dbConnect from '@/lib/mongo';  // Make sure the path is correct
import User from '@/models/user'; // Ensure the path is correct
import Movie from '@/models/Movie';


export default async function handler(req, res) {
    const movieId = req.query.id
    await dbConnect();
    
    const user = await User.find()

    if(user.length > 0){
        const movie = await Movie.findById(movieId);
        if(movie){
            const rating = ((movie.rating / user.length) * 10).toFixed(1);
            res.status(200).json({rating})
        }

    }else{
        res.status(404).json({})
    }
}
