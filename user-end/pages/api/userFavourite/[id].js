import dbConnect from '@/lib/mongo';  // Make sure the path is correct
import UserFavouriteList from '@/models/user_favourite_list';   // Ensure the path is correct
import Movie from '@/models/Movie';

export default async function handler(req, res) {
  
    
    const userId = req.query.id
   
    await dbConnect(); // Connect to the database

    // Fetch all movies from the Movie collection
    const obj = await UserFavouriteList.findOne({userId : userId}); // Ensure this matches the schema
    if (!obj) {
      res.status(404).json({data : [] ,  message: "User has no watch list"});
    }
    else{
      const movies_arr = await Promise.all(
        obj.Favourite_List.map(async (f) => {
          return await Movie.findById(f);
        })
      );
      
      res.status(200).json({ data : movies_arr , message: "ok"}); 
    }

  
}
