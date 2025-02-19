import mongoose from "mongoose";

// Define the Actor Schema
const ActorSchema = new mongoose.Schema({
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
    type: String, // Store the path or URL to the image
    required: true,
  },
}, { collection: 'Actor' });

// Create the Actor model based on the schema
const Actor = mongoose.models.Actor || mongoose.model('Actor', ActorSchema);

export default Actor;
