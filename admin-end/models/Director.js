import mongoose from "mongoose";

const DirectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
}, { collection: 'Director' });

const Director = mongoose.models.Director || mongoose.model('Director', DirectorSchema);

export default Director;