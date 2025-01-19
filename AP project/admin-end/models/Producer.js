import mongoose from "mongoose";

const ProducerSchema = new mongoose.Schema({
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
}, { collection: 'Producer' });

const Producer = mongoose.models.Producer || mongoose.model('Producer', ProducerSchema);

export default Producer;
