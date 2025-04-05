"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
require("./modules/PayrollManagement/config/cronJobs");
require("./modules/meetings/cronjob/meeting-cron");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const adminRoute_1 = __importDefault(require("./modules/admin/routes/adminRoute"));
const userRoutes_1 = __importDefault(require("./modules/employee/routes/userRoutes"));
const managerRoutes_1 = __importDefault(require("./modules/manager/routes/managerRoutes"));
const HrRoutes_1 = __importDefault(require("./modules/hr/routes/HrRoutes"));
const leaveRoutes_1 = __importDefault(require("./modules/leaveManagement/routes/leaveRoutes"));
const departmentRoutes_1 = __importDefault(require("./modules/Department/routes/departmentRoutes"));
const taskRoute_1 = __importDefault(require("./modules/TaskManagement/routes/taskRoute"));
const payrollRoute_1 = __importDefault(require("./modules/PayrollManagement/routes/payrollRoute"));
const commentRoute_1 = __importDefault(require("./modules/TaskManagement/routes/commentRoute"));
const MeetingRoutes_1 = __importDefault(require("./modules/meetings/routes/MeetingRoutes"));
const reqruitmentRoutes_1 = __importDefault(require("./modules/recruitment/routes/reqruitmentRoutes"));
const authRoute_1 = require("./auth/authRoute/authRoute");
const chatModel_1 = __importDefault(require("./modules/chat/chatModel"));
const chatRoutes_1 = __importDefault(require("./modules/chat/chatRoutes"));
const notificaitoRoutes_1 = __importDefault(require("./modules/notification/routes/notificaitoRoutes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies to be sent
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/admin', adminRoute_1.default);
app.use('/employee', userRoutes_1.default);
app.use('/manager', managerRoutes_1.default);
app.use('/Hr', HrRoutes_1.default);
app.use('/leave', leaveRoutes_1.default);
app.use('/department', departmentRoutes_1.default);
app.use('/task', taskRoute_1.default);
app.use('/payroll', payrollRoute_1.default);
app.use('/comment', commentRoute_1.default);
app.use('/meeting', MeetingRoutes_1.default);
app.use('/jobs', reqruitmentRoutes_1.default);
app.use('/chat', chatRoutes_1.default);
app.post('/refresh-token', authRoute_1.refreshToken);
app.use('/notifications', notificaitoRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.send('server is ready here'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
exports.io = io;
io.on('connection', (socket) => {
    // When a user connects, join them to a room based on their user ID
    socket.on('register', (userId) => {
        socket.join(userId);
        // console.log(`User ${userId} joined room ${userId}`);
    });
    socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log('message from client', data);
        const newMessage = new chatModel_1.default({
            sender: data.sender,
            receiver: data.receiver,
            content: data.content,
            messageStatus: data.messageStatus,
            timestamp: new Date(),
        });
        yield newMessage.save();
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
    }));
    socket.on('initiate-video-call', ({ senderId, receiverId, roomId }) => {
        4;
        // console.log(`Initiating video call from ${senderId} to ${receiverId}`);
        io.to(receiverId).emit('video-call-notification', { senderId, roomId });
    });
    socket.on('initiate-video-call', ({ senderId, receiverId, roomId }) => {
        io.to(receiverId).emit('video-call-initiate', { senderId, roomId });
    });
    socket.on('message-seen', (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId }) {
        try {
            // Update all messages from the sender to the receiver as seen
            yield chatModel_1.default.updateMany({ sender: senderId, receiver: receiverId, messageStatus: 'delivered' }, { $set: { seen: true } }, { $set: { messageStatus: 'seen' } });
            // Notify the sender that their messages have been seen
            io.to(senderId).emit('messages-seen', { senderId, receiverId });
        }
        catch (error) {
            console.error('Failed to update seen status:', error);
        }
    }));
    socket.on('disconnect', () => {
        // console.log('user disconnected', socket.id);
    });
});
mongoose_1.default.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 50000 // Increase timeout
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
