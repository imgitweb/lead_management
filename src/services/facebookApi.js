import axios from "axios";

// Apne backend URL ke hisaab se isko adjust karein (e.g., http://localhost:5000/api)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchFbChats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fb/chats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FB chats:", error);
    throw error;
  }
};

export const fetchFbMessages = async (senderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/fb/messages/${senderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching FB messages:", error);
    throw error;
  }
};

export const sendFbReply = async (senderId, messageText, senderName) => {
  try {
    const response = await axios.post(`${BASE_URL}/fb/reply`, {
      senderId,
      messageText,
      senderName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending FB reply:", error);
    throw error;
  }
};