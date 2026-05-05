import axios from "axios";

// Apne backend URL ke hisaab se isko adjust karein
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchWaChats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/wa/chats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching WA chats:", error);
    throw error;
  }
};

export const fetchWaMessages = async (senderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/wa/messages/${senderId}`);
    return response.data; // Yeh { messages: [], isBotEnabled: true/false } return karega
  } catch (error) {
    console.error("Error fetching WA messages:", error);
    throw error;
  }
};

export const toggleWaBotStatus = async (senderId, isBotEnabled) => {
  try {
    const response = await axios.post(`${BASE_URL}/wa/toggle-bot`, {
      senderId,
      isBotEnabled
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling bot status:", error);
    throw error;
  }
};

export const sendWaReply = async (senderId, messageText, senderName) => {
  try {
    const response = await axios.post(`${BASE_URL}/wa/reply`, {
      senderId,
      messageText,
      senderName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending WA reply:", error);
    throw error;
  }
};