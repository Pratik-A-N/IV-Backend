import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GetUserById = async (req,res)=>{
    try {
        // Extract the `id` parameter from the request
        const userId = req.params.id;
    
        // Query the database for the user by ID (replace with your DB query logic)
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
    
        // Check if user exists
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Respond with user data
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

export const GetCurrentUser = async (req,res) =>{
    const userFromToken = req.user;
    try {
        // Extract the `id` parameter from the request
        const userId = userFromToken.userId;
    
        // Query the database for the user by ID (replace with your DB query logic)
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });
    
        // Check if user exists
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Respond with user data
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}