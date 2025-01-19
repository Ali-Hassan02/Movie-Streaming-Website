import fs from 'fs';
import path from 'path';
import Director from '@/models/Director';
import dbConnect from '@/lib/mongodb';
import { CreateImage, deleteImage } from '@/utils';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    
    const { name, description, dateOfBirth, image } = req.body;
    let imageName = req.body.imageName;
    
    if (!image || !name || !description || !dateOfBirth) {
      return res.status(400).json({ message: 'Data is required' });
    }

    let { savedImagePath, savedImageName } = CreateImage("default-director.jpg", image, imageName);

    try {
      await dbConnect();
      const newDirector = new Director({
        name,
        description,
        dateOfBirth,
        image: savedImageName || imageName,  
      });
      await newDirector.save();
      res.status(200).json({
        message: 'Director added successfully',
        director: newDirector,
      });
    } catch (error) {
      console.error('Error saving director:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error saving director' });
    }
  } 
  
  else if (req.method === 'GET') {
    try {
      await dbConnect();
      const directors = await Director.find();  
      res.status(200).json({ directors });
    } catch (error) {
      console.error('Error fetching directors:', error);
      res.status(500).json({ message: 'Error fetching directors' });
    }
  } 

  else if (req.method === 'PUT') {
    try {
      const { _id, name, description, dateOfBirth, image } = req.body;
      let imageName = req.body.imageName;
      
      if (!_id || !name || !description || !dateOfBirth) {
        return res.status(400).json({ message: 'Data is required' });
      }

      await dbConnect();

      const director = await Director.findById(_id);
      if (!director) {
        return res.status(404).json({ message: 'Director not found' });
      }

      const imageToDelete = director.image;

      let { savedImagePath, savedImageName } = CreateImage("default-director.jpg", image, imageName);

      director.name = name;
      director.description = description;
      director.dateOfBirth = dateOfBirth;
      director.image = savedImageName || imageName;

      await director.save();

      deleteImage('default-director.jpg', imageToDelete)
      
      res.status(200).json({
        message: 'Director updated successfully',
        director,
      });

    } catch (error) {
      console.error('Error updating director:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error updating director' });
    }
  }

  else if (req.method === 'DELETE') {

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'Director ID is required' });
    }

    try {
      await dbConnect();
      const director = await Director.findById(id);
      if (!director) {
        return res.status(404).json({ message: 'Director not found' });
      }
      await Director.findByIdAndDelete(id);
      
      deleteImage('default-director.jpg', director.image);
      
      res.status(200).json({
        message: 'Director deleted successfully',
      });

    } catch (error) {
      console.error('Error deleting director:', error);
      res.status(500).json({ message: 'Error deleting director' });
    }
  } 

  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
  
}