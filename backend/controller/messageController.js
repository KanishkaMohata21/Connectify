import MessageModel from '../models/messageModel.js'
import { mongoose } from 'mongoose'

export const addMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body; 
    const newMessage = new MessageModel({
        chatId: chatId, 
        senderId: senderId,
        text: text
    });
    try {
        const result = await newMessage.save();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while saving the message' });
    }
};


export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    
    // Check if chatId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ error: 'Invalid chatId' });
    }

    console.log(`Received chatId: ${chatId}`);  // Log the chatId

    try {
        const messages = await MessageModel.find({ chatId });
        console.log(`Fetched messages: ${JSON.stringify(messages)}`);  // Log the fetched messages
        
        if (messages.length === 0) {
            console.log(`No messages found for chatId: ${chatId}`);
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error(`Error fetching messages for chatId ${chatId}:`, error);
        res.status(500).json({ error: 'An error occurred while fetching the messages' });
    }
};