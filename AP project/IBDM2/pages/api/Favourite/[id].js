import dbConnect from '@/lib/mongo';  // Make sure the path is correct
import UserFavouriteList from '@/models/user_favourite_list';   // Ensure the path is correct
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import Movie from '@/models/Movie';

export default async function handler(req, res) {
  
  if(req.method === 'POST'){
  
    try {
    const userId = req.query.id
    const movieId = req.body.movieId
    console.log(userId)
    await dbConnect(); // Connect to the database

    // Fetch all movies from the Movie collection
    const obj = await UserFavouriteList.findOne({userId : userId}); // Ensure this matches the schema
    
    if (!obj) {
      
      const fav_movie = new UserFavouriteList({
        userId,  
        Favourite_List: [movieId]  
      });
      await fav_movie.save();
     
      return res.status(201).json({ type : 'added' , message: 'User favourite list created and movie added.' });
    } else  {
      const found_movie = obj.Favourite_List.find((x) => x._id.toString() === movieId.toString());
      if(found_movie){
        const new_fav_list = obj.Favourite_List.filter((x) => x._id.toString() !== movieId.toString());
        if(new_fav_list.length === 0){
          await UserFavouriteList.findByIdAndDelete(obj._id);
          
        }else{
          obj.Favourite_List = new_fav_list
          obj.save()
        }
        return res.status(200).json({ type : 'deleted' , message: 'Movie removed from user favourite list.' });
      }else{
        
        obj.Favourite_List.push(movieId);  
        await obj.save();
       
        return res.status(200).json({ type : 'added' ,message: 'Movie added to the user\'s favourite list.' });
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
      const obj = await UserFavouriteList.findOne({userId : userId}); // Ensure this matches the schema
      if (!obj) {
        res.status(201).json({ type : false , message: "user not found"});
      }
      else{
        const found_movie = obj.Favourite_List.find((x) => x._id.toString() === movieId.toString());
        if(found_movie){
          res.status(200).json({ type : true , message: "Movie Found"});
        }
        else{
          res.status(202).json({ type : false , message: "Movie not found"});
        }
      }

    }
}
