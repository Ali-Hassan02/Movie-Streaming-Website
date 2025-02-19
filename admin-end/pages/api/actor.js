import fs from 'fs';
import path from 'path';
import Actor from '@/models/Actor';
import dbConnect from '@/lib/mongodb';
import { CreateImage , deleteImage} from '@/utils';


export default async function handler(req, res) {

  if (req.method === 'POST') {

    const { name, description, dateOfBirth, image } = req.body;
    let imageName = req.body.imageName;
    if (!image || !name || !description || !dateOfBirth) {
      return res.status(400).json({ message: 'Data is required' });
    }

    let { savedImagePath, savedImageName } = CreateImage("default-actor.jpg", image, imageName);

    try {
      await dbConnect();
      const newActor = new Actor({
        name,
        description,
        dateOfBirth,
        image: savedImageName || imageName, 
      });
      await newActor.save();
      res.status(200).json({
        message: 'Actor added successfully',
        actor: newActor,
      });
    } catch (error) {
      console.error('Error saving actor:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error saving actor' });
    }
  }
  
  else if (req.method === 'GET') {
    try {
      await dbConnect();
      const actors = await Actor.find();  
      res.status(200).json({ actors });
    } catch (error) {
      console.error('Error fetching actors:', error);
      res.status(500).json({ message: 'Error fetching actors' });
    }
  } 

  else if (req.method === 'PUT') {

    try{
      const { _id, name, description, dateOfBirth, image } = req.body;
      let imageName = req.body.imageName;

      if (!_id || !name || !description || !dateOfBirth) {
        return res.status(400).json({ message: 'Data is required' });
      }

      await dbConnect();

      const actor = await Actor.findById(_id);

      if (!actor) {
        return res.status(404).json({ message: 'Actor not found' });
      }

      const imageToDelete = actor.image;

      let { savedImagePath, savedImageName } = CreateImage("default-actor.jpg", image, imageName);

      actor.name = name;
      actor.description = description;
      actor.dateOfBirth = dateOfBirth;
      actor.image = savedImageName || imageName; 
      await actor.save();

      deleteImage('default-actor.jpg', imageToDelete);

      res.status(200).json({
        message: 'Actor updated successfully',
        actor,
      });
    }
    catch (error) {
      console.error('Error updating actor:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error updating actor' });
    }
  }

  else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Actor ID is required' });
    }
    try {
      await dbConnect();

      const actor = await Actor.findById(id);
      if (!actor) {
        return res.status(404).json({ message: 'Actor not found' });
      }

      await Actor.findByIdAndDelete(id);

      deleteImage('default-actor.jpg' , actor.image);

      res.status(200).json({
        message: 'Actor deleted successfully',
      });

    } catch (error) {
      console.error('Error deleting actor:', error);
      res.status(500).json({ message: 'Error deleting actor' });
    }
  }

  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
