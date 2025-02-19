import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { filename } = req.query; 
  if (!filename) {
    return res.status(400).json({ message: 'Filename is required' });
  }

  const imagePath = path.join(process.cwd(), 'server', 'uploads', filename);


  if (fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.status(200).send(imageBuffer);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
}
