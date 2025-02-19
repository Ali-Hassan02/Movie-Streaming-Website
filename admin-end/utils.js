import fs from 'fs';
import path from 'path';

export const CreateImage = (defaultName, image , imageName)=>{

    let savedImagePath;
    let savedImageName;

    if (image && imageName !== defaultName) {
      const imageBuffer = Buffer.from(image, 'base64');
      const uploadsFolder = path.join(process.cwd(), 'server', 'uploads');
      if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder, { recursive: true });
      }
      const fileName = `${Date.now()}.jpg`;
      const filePath = path.join(uploadsFolder, fileName);
      fs.writeFileSync(filePath, imageBuffer);
      savedImageName = fileName;  
      savedImagePath= filePath;
    }

    return { savedImagePath, savedImageName };
}

export const deleteImage = (defaultName, image)=>{
    if (image && image !== defaultName) {
        const imagePath = path.join(process.cwd(), 'server', 'uploads', image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);  
        }
    }
}