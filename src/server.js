import AuthRouter from "./Routes/authenticationRouter.js"
import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import userRouter from "./Routes/userRouter.js"
import { AuthMiddleware } from "./Middlewares/AuthMiddleware.js"

const corsOptions = {
    origin:'http://localhost:5173', 
    credentials:true,
    optionSuccessStatus:200
}

const app = express()
const PORT = 8000

// Initialize an HTTP server based on Express
const server = http.createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(server, {
    cors: {
      origin: '*', // Adjust to your frontend's origin for production
      methods: ['GET', 'POST'],
    },
  });

app.use(cors(corsOptions))

app.use(express.json())

app.use('/authenticate', AuthRouter)
app.use(AuthMiddleware);
app.use('/user',userRouter)

// Set up socket.io
let rooms = [];
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    socket.on('createRoom', ({ username, modelName, roomName },callback) => {
      const roomId = roomName.trim().split(' ').join('-');
      if (io.sockets.adapter.rooms.get(roomId)) {
        callback({ success: false, error: 'Room name is already taken.' });
        return;
      }

      if(!rooms[roomId]){
        rooms[roomId] = { users: [{username:username, modelName: modelName, position: [0,0,0], rotationY: 0, movement: false}] }
      }
  
      socket.join(roomId);
      socket.emit("userJoined",rooms[roomId].users);
      console.log(`Room created : ${roomName} (ID: ${roomId})`);
      callback({ success: true, roomId: roomId });
    });
  
    socket.on('joinRoom', ({roomId, username, modelName}) => {
      if (io.sockets.adapter.rooms.get(roomId)) {
        socket.join(roomId);
        const user = {
            username : username,
            modelName: modelName,
            position: [0,0,0],
            rotationY: 0,
            movement: false
        }

        if(rooms[roomId].users){
          rooms[roomId].users.push(user);
        }
        console.log(rooms[roomId]);
        socket.emit("userJoined",rooms[roomId].users)
        socket.to(roomId).emit('userJoined', rooms[roomId].users);
        console.log(`User ${socket.id} joined room ${roomId}`);
      } else {
        console.log(`Room ${roomId} does not exist.`);
      }
    });
    
    socket.on('changedMyPosition', ({roomId, username, position, rotationY, movement})=>{
      // console.log(rotationY);
      if(rooms[roomId]){
        rooms[roomId].users.map((user) => {
          if(user.username == username){
            user.position = position;
            user.rotationY = rotationY;
            user.movement = movement;
          }
        })
        socket.emit("userJoined",rooms[roomId].users)
        socket.to(roomId).emit('userJoined', rooms[roomId].users);
      }else{
        console.log(`Room ${roomId} does not exist.`)
      }
    })
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
  
  // Start the server
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });