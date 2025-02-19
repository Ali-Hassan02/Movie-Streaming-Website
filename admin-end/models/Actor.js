import mongoose from "mongoose";

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
    type: String, 
    required: true,
  },
}, { collection: 'Actor' });

const Actor = mongoose.models.Actor || mongoose.model('Actor', ActorSchema);

export default Actor;
