const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const { getAIReply } = require('../service/aiService');

// Store active users: userId -> socketId
const activeUsers = new Map();
const userTyping = new Map();

/**
 * Initialize socket event handlers
 * @param {Server} io - Socket.io server instance
 */
const initializeSocketHandlers = (io) => {
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.id}`);

        // ============ AUTHENTICATION & USER JOIN ============
        socket.on('user:join', async (data) => {
            try {
                const token = data.token;
                if (!token) {
                    socket.emit('error', { message: 'No token provided' });
                    return;
                }

                // Verify JWT
                const payload = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');
                const userId = payload._id;

                // Store socket connection
                activeUsers.set(userId, socket.id);
                socket.userId = userId;

                // Update user lastActive
                await User.findByIdAndUpdate(userId, {
                    lastActive: new Date(),
                });

                // Join a room with userId for direct messaging
                socket.join(userId);
                console.log(` User ${userId} joined room`);

                // Notify others that user is online
                io.emit('user:online', { userId, status: 'online' });

            } catch (error) {
                console.error(' Join error:', error.message);
                socket.emit('error', { message: 'Authentication failed' });
            }
        });

        // ============ SEND MESSAGE ============
        socket.on('message:send', async (data) => {
            try {
                const { senderId, receiverId, courseId, message } = data;

                // Debug logging: show incoming payload and socket context
                console.log('message:send received on server:', {
                    socketId: socket.id,
                    socketUserId: socket.userId,
                    payload: data,
                });

                if (!senderId || !receiverId || !courseId || !message) {
                    socket.emit('error', { message: 'Missing required fields' });
                    return;
                }

                // Validate ObjectIds
                if (
                    !mongoose.Types.ObjectId.isValid(senderId) ||
                    !mongoose.Types.ObjectId.isValid(receiverId) ||
                    !mongoose.Types.ObjectId.isValid(courseId)
                ) {
                    socket.emit('error', { message: 'Invalid IDs' });
                    return;
                }

                // Get sender and receiver
                const sender = await User.findById(senderId);
                const receiver = await User.findById(receiverId);

                if (!sender || !receiver) {
                    socket.emit('error', { message: 'User not found' });
                    return;
                }

                const senderRole = sender.role === 'teacher' ? 'teacher' : 'student';

                // Save message to database
                const newMessage = await ChatMessage.create({
                    senderId,
                    receiverId,
                    courseId,
                    senderRole,
                    message,
                });

                console.log(` Message saved: ${senderRole} → ${receiverId}`);

                // Debug: check whether receiver room exists and activeUsers map
                const room = io.sockets.adapter.rooms.get(String(receiverId));
                const roomMembers = room ? Array.from(room) : [];
                console.log('Delivery debug:', {
                    receiverId,
                    activeUsersHasReceiver: activeUsers.has(String(receiverId)),
                    roomMembers,
                });

                // Emit to receiver in real-time
                io.to(receiverId).emit('message:receive', {
                    _id: newMessage._id,
                    senderId,
                    receiverId,
                    courseId,
                    senderRole,
                    message,
                    createdAt: newMessage.createdAt,
                    isAI: false,
                });

                // Emit confirmation to sender
                socket.emit('message:sent', {
                    _id: newMessage._id,
                    status: 'sent',
                });

                // ============ AI REPLY LOGIC ============
                // If student sends message to offline teacher, trigger AI reply
                if (senderRole === 'student') {
                    const isTeacherOnline = activeUsers.has(receiverId);

                    if (!isTeacherOnline) {
                        console.log('Teacher offline - Triggering AI reply...');
                        let aiReply = "I'll get back to you soon.";

                        try {
                            aiReply = await getAIReply(message, courseId);
                            console.log(' AI Reply received');
                        } catch (aiError) {
                            console.error('AI Error:', aiError.message);
                        }

                        // Create AI message in DB
                        const aiMessage = await ChatMessage.create({
                            senderId: new mongoose.Types.ObjectId(),
                            receiverId: senderId,
                            courseId,
                            senderRole: 'ai',
                            isAI: true,
                            message: aiReply,
                        });

                        // Emit AI message to student
                        io.to(senderId).emit('message:receive', {
                            _id: aiMessage._id,
                            senderId: aiMessage.senderId,
                            receiverId: senderId,
                            courseId,
                            senderRole: 'ai',
                            message: aiReply,
                            createdAt: aiMessage.createdAt,
                            isAI: true,
                        });
                    }
                }

            } catch (error) {
                console.error('Send message error:', error.message);
                socket.emit('error', { message: error.message });
            }
        });

        // ============ TYPING INDICATOR ============
        socket.on('typing:start', (data) => {
            try {
                const { userId, receiverId, courseId } = data;
                userTyping.set(`${userId}-${receiverId}`, true);

                io.to(receiverId).emit('typing:indicator', {
                    userId,
                    courseId,
                    isTyping: true,
                });

                console.log(` ${userId} is typing in course ${courseId}`);
            } catch (error) {
                console.error('Typing start error:', error.message);
            }
        });

        socket.on('typing:stop', (data) => {
            try {
                const { userId, receiverId, courseId } = data;
                userTyping.delete(`${userId}-${receiverId}`);

                io.to(receiverId).emit('typing:indicator', {
                    userId,
                    courseId,
                    isTyping: false,
                });

            } catch (error) {
                console.error(' Typing stop error:', error.message);
            }
        });

        // ============ ONLINE STATUS ============
        socket.on('status:check', async (data) => {
            try {
                const { userIds } = data;
                const onlineStatuses = {};

                for (const userId of userIds) {
                    onlineStatuses[userId] = activeUsers.has(userId);
                }

                socket.emit('status:response', onlineStatuses);
            } catch (error) {
                console.error('Status check error:', error.message);
            }
        });

        // ============ DISCONNECT ============
        socket.on('disconnect', async () => {
            try {
                if (socket.userId) {
                    activeUsers.delete(socket.userId);
                    console.log(`User disconnected: ${socket.userId}`);

                    // Notify others that user is offline
                    io.emit('user:offline', { userId: socket.userId, status: 'offline' });

                    // Update user lastActive
                    await User.findByIdAndUpdate(socket.userId, {
                        lastActive: new Date(),
                    });
                }
            } catch (error) {
                console.error('Disconnect error:', error.message);
            }
        });

        // ============ ERROR HANDLER ============
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });
};

module.exports = initializeSocketHandlers;
