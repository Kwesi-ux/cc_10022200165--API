import jwt from "jsonwebtoken"
import { UserModel } from "../models/User.js"
import dotenv from 'dotenv'
dotenv.config({ path: './config/.env' }) // ✅ fixed path: from server root, not relative

export const VerifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
      try {
        if (err) {
          return res.status(401).json({ error: "Unauthorized." });
        }
        
        console.log("Payload", payload)
        const user = await UserModel.findOne({ _id: payload._id }).select("-password");
        console.log("User",user)

        if (!user) {
          return res.status(404).json({ error: "User not found." });
        }

        req.user = user;
        next();
      } catch (err) {
        return res.status(500).json({ error: err.message }); // ✅ fixed typo: staus → status
      }
    });
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
}
