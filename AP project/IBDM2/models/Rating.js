import mongoose from 'mongoose';
const { Schema } = mongoose;
const UserRatingSchema = new mongoose.Schema(
    {
      
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true,
        unique : true
      } , 
      Rating_List: {
        type: [Schema.Types.ObjectId],
        ref: 'Movie', 
        required: true,
      }
    },
    { timestamps: true, collection: 'UserRating' }  // Updated collection name for clarity
  );
  
const UserRating = mongoose.models.UserRating || mongoose.model('UserRating', UserRatingSchema);
  
export default UserRating;
  