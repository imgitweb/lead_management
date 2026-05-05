import axios from "axios";

// Apne backend URL ke hisaab se isko adjust karein
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const fetchInstaChats = async () => {
  try {
    // Ye route aapke backend routes me /insta/chats ya /ig/chats hona chahiye
    const response = await axios.get(`${BASE_URL}/insta/chats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Instagram chats:", error);
    throw error;
  }
};

export const fetchInstaMessages = async (senderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/insta/messages/${senderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Instagram messages:", error);
    throw error;
  }
};

export const sendInstaReply = async (senderId, messageText, senderName) => {
  try {
    const response = await axios.post(`${BASE_URL}/insta/reply`, {
      senderId,
      messageText,
      senderName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending Instagram reply:", error);
    throw error;
  }
};