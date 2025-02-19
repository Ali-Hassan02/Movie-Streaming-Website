// pages/api/users.js
import dbConnect from '../../lib/mongodb';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

export default async function handler(req, res) 
{
  await dbConnect();

  if(req.method === "POST"){

    const {email, password} = req.body;

    try{
      const employee = await Employee.findOne({email});

      if(!employee){
        return res.status(404).json({type: 'email' ,message:'Email not exists'});
      }

      const isMatched = await bcrypt.compare(password, employee.password);
      if(!isMatched){
        return res.status(401).json({type: 'password' ,message: 'Incorrect Password'});
      }

      const token = jwt.sign(
        { id: employee._id, email: employee.email, name:employee.name }, 
        process.env.JWT_SECRET,                     
        { expiresIn: '8h' }                        
      );

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`);
      
      return res.status(200).json({ type:'success', employee})
    }
    catch(err){
      console.error("Error fetching employee:", err);
      return res.status(500).json({message: "Some Error Occured"});
    }
  }
}
