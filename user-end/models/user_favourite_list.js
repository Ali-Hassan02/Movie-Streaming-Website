import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserFavouriteListSchema = new mongoose.Schema(
    {
      
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
        unique : true
      } , 
      Favourite_List: {
        type: [Schema.Types.ObjectId],
        ref: 'Movie', 
        required: true,
      }
    },
    { timestamps: true, collection: 'user_favourite_list' }  // Updated collection name for clarity
  );
  
const UserFavouriteList = mongoose.models.UserFavouriteList || mongoose.model('UserFavouriteList', UserFavouriteListSchema);
  
export default UserFavouriteList;
  