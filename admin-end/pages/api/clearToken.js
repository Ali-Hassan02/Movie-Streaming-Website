import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', serialize('token', '', {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',  
      path: '/', 
      maxAge: -1,  
    }));

    res.status(200).json({ message: 'Successfully logged out and cookies cleared' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
