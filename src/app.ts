import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import './modules/PayrollManagement/config/cronJobs'
import './modules/meetings/cronjob/meeting-cron'
import { Server } from 'socket.io';
import http from 'http';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import adminRoutes from './modules/admin/routes/adminRoute';
import employeeRoutes from './modules/employee/routes/userRoutes'
import managerRoutes from './modules/manager/routes/managerRoutes'
import HrRoutes from './modules/hr/routes/HrRoutes'
import LeaveRoute from './modules/leaveManagement/routes/leaveRoutes'
import Department from './modules/Department/routes/departmentRoutes'
import TaskRoute from './modules/TaskManagement/routes/taskRoute'
import payroll from './modules/PayrollManagement/routes/payrollRoute'
import comment from './modules/TaskManagement/routes/commentRoute'
import meeting from './modules/meetings/routes/MeetingRoutes'
import jobs from './modules/recruitment/routes/reqruitmentRoutes'
import { refreshToken } from './auth/authRoute/authRoute';
import Message from './modules/chat/chatModel';
import chat from './modules/chat/chatRoutes'
import notification from './modules/notification/routes/notificaitoRoutes'

const app = express();
const server = http.createServer(app)


app.use(express.json());
app.use(cors({
  origin: '*', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Allow cookies to be sent
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));


app.use('/admin', adminRoutes);
app.use('/employee',employeeRoutes)
app.use('/manager',managerRoutes)
app.use('/Hr',HrRoutes)
app.use('/leave',LeaveRoute)
app.use('/department',Department)
app.use('/task',TaskRoute)
app.use('/payroll',payroll)
app.use('/comment',comment)
app.use('/meeting',meeting)
app.use('/jobs',jobs)
app.use('/chat',chat)
app.post('/refresh-token', refreshToken);
app.use('/notifications', notification);




app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => res.send('server is ready here'));


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const io = new Server(server,{

  cors:{
    origin:'*',
    methods:['GET','POST']
  }
})
export { io };

io.on('connection', (socket) => {
  // When a user connects, join them to a room based on their user ID
  socket.on('register', (userId) => {
    socket.join(userId);
    // console.log(`User ${userId} joined room ${userId}`);

    // >>>>>>> IMPORTANT ADDITION START <<<<<<<
    // Store the userId directly on the socket object for easy access on disconnect
    socket.data.userId = userId;
    // >>>>>>> IMPORTANT ADDITION END <<<<<<<
  });

  socket.on('message', async (data) => {
    // console.log('message from client', data);

    const newMessage = new Message({
      sender: data.sender,
      receiver: data.receiver,
      content: data.content,
      messageStatus: data.messageStatus,
      timestamp: new Date(),
    });

    await newMessage.save();

    // Send the message to the recipient's room
    io.to(data.receiver).emit('message', data);

    const lastMessage = {
      content: newMessage.content,
      timestamp: newMessage.timestamp,
      sender: data.sender,
      receiver: data.receiver,
    };

    io.to(data.sender).emit('update-last-message', lastMessage);
    io.to(data.receiver).emit('update-last-message', lastMessage);

    // Optionally send the message back to the sender
    socket.emit('message', data);
  });

  socket.on('initiate-video-call', ({ senderId, receiverId, roomId }) => {
    // console.log(`Initiating video call from ${senderId} to ${receiverId}`);
    io.to(receiverId).emit('video-call-notification', { senderId, roomId });
  });

  socket.on('initiate-video-call', ({ senderId, receiverId, roomId }) => {
    io.to(receiverId).emit('video-call-initiate', { senderId, roomId });
  });

  socket.on('message-seen', async ({ senderId, receiverId }) => {
    try {
      // Update all messages from the sender to the receiver as seen
      await Message.updateMany(
        // The third argument to updateMany is the options object, not another update object.
        // You were trying to set messageStatus: 'seen' as an option before.
        // It should be combined into the $set object.
        { sender: senderId, receiver: receiverId, messageStatus: 'delivered' },
        { $set: { seen: true, messageStatus: 'seen' } } // Combine updates here
      );

      // Notify the sender that their messages have been seen
      io.to(senderId).emit('messages-seen', { senderId, receiverId });
    } catch (error) {
      console.error('Failed to update seen status:', error);
    }
  });

  // >>>>>>> CODE TO UPDATE STARTS HERE <<<<<<<
  socket.on('disconnect', async () => {
    const userId = socket.data.userId; // Retrieve the userId stored during 'register'
    // console.log('user disconnected', socket.id); // You can keep this for debugging

    if (userId) {
      console.log(`User ${userId} disconnected. Updating message statuses.`);
      try {
        // Update messages that this user (who just disconnected) received
        // and had previously marked as 'seen', back to 'delivered' and seen: false
        await Message.updateMany(
          { receiver: userId, messageStatus: 'seen' }, // Query: Find messages received by this user that are 'seen'
          { $set: { messageStatus: 'delivered', seen: false } } // Update: Set status to 'delivered' and seen to false
        );
        console.log(`Messages for disconnected user ${userId} updated to 'delivered'.`);
      } catch (error) {
        console.error('Error updating message status on disconnect:', error);
      }
    }
  });
  // >>>>>>> CODE TO UPDATE ENDS HERE <<<<<<<
});



mongoose.connect(process.env.MONGO_URI!,{
  serverSelectionTimeoutMS: 50000 // Increase timeout
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});