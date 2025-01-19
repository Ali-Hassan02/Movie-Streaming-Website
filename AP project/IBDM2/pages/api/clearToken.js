import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Clear the token cookie by setting its value to an empty string and maxAge to -1
    res.setHeader('Set-Cookie', serialize('token', '', {
      httpOnly: true,  // Makes the cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
      sameSite: 'strict',  // Prevents CSRF
      path: '/',  // Cookie is available to the entire domain
      maxAge: -1,  // Expires immediately
    }));

    res.status(200).json({ message: 'Successfully logged out and cookies cleared' });
  } else {
    // If method is not POST, return Method Not Allowed
    res.status(405).json({ error: 'Method not allowed' });
  }
}
