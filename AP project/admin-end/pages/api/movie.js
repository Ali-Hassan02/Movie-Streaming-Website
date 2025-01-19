import fs from 'fs';
import path from 'path';
import Movie from '@/models/Movie';
import dbConnect from '@/lib/mongodb';
import { CreateImage, deleteImage } from '@/utils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, type, rating, releaseDate, duration, genres, actors, thumbnail, trailer, directors, producers} = req.body;
    let imageName = req.body.thumbnailName;

    if (!title || !description || !type || !rating || !releaseDate || !duration || !genres || !actors || !trailer || !thumbnail || !directors || !producers) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let { savedImagePath, savedImageName } = CreateImage("default-movie.jpg", thumbnail, imageName);

    try {
      await dbConnect();
      const newMovie = new Movie({
        title,
        description,
        type,
        rating,
        releaseDate,
        duration,
        genres,
        actors,
        thumbnail: savedImageName || "default-movie.jpg",
        trailer, 
        directors,
        producers,
      });
      await newMovie.save();
      res.status(200).json({
        message: 'Movie added successfully',
        movie: newMovie,
      });
    } catch (error) {

      console.error('Error saving movie:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error saving movie' });
    }
  }

  else if (req.method === 'PUT') {
    try {

      const { _id, title, description, type, rating, releaseDate, duration, genres, actors, thumbnail, trailer, directors, producers } = req.body;
      let imageName = req.body.thumbnailName ;
      
      if (!_id || !title || !description || !trailer || !type || !rating || !releaseDate || !duration || !genres || !actors || !thumbnail || !directors || !producers) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      await dbConnect();

      const movie = await Movie.findById(_id);

      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
  
      const imageToDelete = movie.thumbnail; 

      let { savedImagePath, savedImageName } = CreateImage("default-movie.jpg", thumbnail, imageName);

      movie.title = title;
      movie.description = description;
      movie.type = type;
      movie.rating = rating;
      movie.releaseDate = releaseDate;
      movie.duration = duration;
      movie.genres = genres;
      movie.actors = actors;
      movie.thumbnail = savedImageName || imageName;
      movie.trailer = trailer;
      movie.directors = directors;
      movie.producers = producers;

      await movie.save();
      
      deleteImage('default-movie.jpg', imageToDelete)
      
      res.status(200).json({
        message: 'Movie updated successfully',
        movie,
      });

    } catch (error) {

      console.error('Error updating movie:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error updating movie' });

    }
  }

  else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Movie ID is required' });
    }
    try {
      await dbConnect();

      const movie = await Movie.findById(id);

      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      await Movie.findByIdAndDelete(id);
      
      deleteImage('default-movie.jpg', movie.thumbnail);

      res.status(200).json({
        message: 'Movie deleted successfully',
      });

    } catch (error) {

      console.error('Error deleting movie:', error);
      res.status(500).json({ message: 'Error deleting movie' });

    }
  } 
  
  else if (req.method === 'GET') {
    try {

      await dbConnect();
      const movies = await Movie.find();  
      res.status(200).json({ movies });

    } catch (error) {

      console.error('Error fetching producers:', error);
      res.status(500).json({ message: 'Error fetching producers' });

    }
  }

  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

}