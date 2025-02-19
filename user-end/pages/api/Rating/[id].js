import dbConnect from '@/lib/mongo';  // Make sure the path is correct
import UserRating from '@/models/Rating';  // Ensure the path is correct
import Movie from '@/models/Movie';

async function Handle_Rating (action , id){
    const obj = await Movie.findOne({_id : id});
    if (action === 'add'){
       
        if (obj){
            obj.rating = obj.rating + 1
            await obj.save()
        }
        
    }else{
        if(obj){
            obj.rating = obj.rating - 1
            await obj.save()
        }
    }
}

export default async function handler(req, res) {
    if(req.method === 'POST'){
  try {
    const userId = req.query.id
    const movieId = req.body.movieId
    
    await dbConnect(); // Connect to the database

    // Fetch all movies from the Movie collection
    const obj = await UserRating.findOne({userId : userId}); // Ensure this matches the schema
    
    if (!obj) {
      
      const rat_movie = new UserRating({
        userId,  
        Rating_List: [movieId]  
      });
      await rat_movie.save();
      Handle_Rating('add' , movieId)
      return res.status(201).json({ type : 'added' , message: 'User rating list created and  added.' });
    } else  {
      const found_movie = obj.Rating_List.find((x) => x._id.toString() === movieId.toString());
      if(found_movie){
        const new_rat_list = obj.Rating_List.filter((x) => x._id.toString() !== movieId.toString());
        if(new_rat_list.length === 0){
          await UserRating.findByIdAndDelete(obj._id);
          
        }else{
          obj.Rating_List = new_rat_list
          obj.save()
        }
        Handle_Rating('delete' , movieId)
        return res.status(200).json({ type : 'deleted' , message: 'Movie removed from user Rating list.' });
      }else{
        
        obj.Rating_List.push(movieId);  
        await obj.save();
        Handle_Rating('add' , movieId)
        return res.status(200).json({ type : 'added' ,message: 'Movie added to the user\'s rating list.' });
      }
      
    }
  } catch (error) {
    console.error('Error fetching movies:', error);  // Log the error
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
    else{
      
      const userId = req.query.id
      const movieId = req.query.movieId
      await dbConnect(); // Connect to the database

      // Fetch all movies from the Movie collection
      const obj = await UserRating.findOne({userId : userId}); // Ensure this matches the schema
      if (!obj) {
        res.status(201).json({ type : false , message: "user not found"});
      }
      else{
        const found_movie = obj.Rating_List.find((x) => x._id.toString() === movieId.toString());
        
        if(found_movie){
          res.status(200).json({ type : true , message: "Movie Found"});
        }
        else{
          res.status(202).json({ type : false , message: "Movie not found"});
        }
      }

    }
}
