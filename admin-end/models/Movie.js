const mongoose = require('mongoose');


const { Schema } = mongoose;

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, 
      required: true,
    },
    genres: {
      type: [String], 
      required: true,
    },
    actors: {
      type: [Schema.Types.ObjectId],
      ref: 'Actor', 
      required: true,
    },
    thumbnail: {
      type: String, 
      required: true,
    },
    trailer: {
      type: String, 
      required: true,
    },
    directors: {
      type: [Schema.Types.ObjectId],
      ref: 'Director', 
      required: true,
    },
    producers: {
      type: [Schema.Types.ObjectId],
      ref: 'Producer', 
      required: true,
    }
  }, { collection: 'Movie' });

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie;