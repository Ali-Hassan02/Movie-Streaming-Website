import fs from 'fs';
import path from 'path';
import Producer from '@/models/Producer';
import dbConnect from '@/lib/mongodb';
import { CreateImage, deleteImage } from '@/utils';

export default async function handler(req, res) {
  
  if (req.method === 'POST') {

    const { name, description, dateOfBirth, image } = req.body;
    let imageName = req.body.imageName;

    if (!image || !name || !description || !dateOfBirth) {
      return res.status(400).json({ message: 'Data is required' });
    }

    let { savedImagePath, savedImageName } = CreateImage("default-producer.jpg", image, imageName);

    try {

      await dbConnect();

      const newProducer = new Producer({
        name,
        description,
        dateOfBirth,
        image: savedImageName || imageName,  
      });

      await newProducer.save();

      res.status(200).json({
        message: 'Producer added successfully',
        producer: newProducer,
      });

    } catch (error) {

      console.error('Error saving producer:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error saving producer' });

    }
  } 

  else if (req.method === 'GET') {
    try {
      await dbConnect();
      const producers = await Producer.find();  
      res.status(200).json({ producers });
    } catch (error) {
      console.error('Error fetching producers:', error);
      res.status(500).json({ message: 'Error fetching producers' });
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

      const producer = await Producer.findById(_id);

      if (!producer) {
        return res.status(404).json({ message: 'Producer not found' });
      }

      const imageToDelete = producer.image;

      let { savedImagePath, savedImageName } = CreateImage("default-producer.jpg", image, imageName);

      producer.name = name;
      producer.description = description;
      producer.dateOfBirth = dateOfBirth;
      producer.image = savedImageName || imageName; 

      await producer.save();

      deleteImage('default-producer.jpg' ,imageToDelete);
      
      res.status(200).json({
        message: 'Producer updated successfully',
        producer,
      });

    } catch (error) {

      console.error('Error updating producer:', error);
      if (savedImagePath && fs.existsSync(savedImagePath)) {
        fs.unlinkSync(savedImagePath);
      }
      res.status(500).json({ message: 'Error updating producer' });

    }
  }

  else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Producer ID is required' });
    }
    try {
      await dbConnect();

      const producer = await Producer.findById(id);

      if (!producer) {
        return res.status(404).json({ message: 'Producer not found' });
      }

      await Producer.findByIdAndDelete(id);

      deleteImage('default-producer.jpg' , producer.image);
      
      res.status(200).json({
        message: 'Producer deleted successfully',
      });

    } catch (error) {

      console.error('Error deleting producer:', error);
      res.status(500).json({ message: 'Error deleting producer' });

    }
  } 

  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

}