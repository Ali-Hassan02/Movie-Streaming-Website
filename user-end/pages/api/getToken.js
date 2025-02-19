import jwt from "jsonwebtoken";
export default function handler(req, res) {
  const token = req.cookies.token;  
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ user: decoded });
  } else {
    res.status(401).json({ error: "No token found" });
  }
}