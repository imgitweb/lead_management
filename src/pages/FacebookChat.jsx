import React, { useState, useEffect, useRef } from "react";
import { fetchFbChats, fetchFbMessages, sendFbReply } from "../api/facebookApi";

const FacebookChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Auto-scroll ke liye ref
  const messagesEndRef = useRef(null);

  // 1. Load all unique chats on component mount
  useEffect(() => {
    loadChats();
  }, []);

  // 2. Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = async () => {
    setLoadingChats(true);
    try {
      const data = await fetchFbChats();
      setChats(data);
    } catch (error) {
      alert("Failed to load chats");
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    setLoadingMessages(true);
    try {
      const chatHistory = await fetchFbMessages(chat._id);
      setMessages(chatHistory);
    } catch (error) {
      alert("Failed to load message history");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    setSending(true);
    try {
      const response = await sendFbReply(
        selectedChat._id,
        replyText,
        selectedChat.senderName
      );
      
      // Update local messages array immediately for better UX
      setMessages((prev) => [...prev, response.reply]);
      setReplyText("");
      
      // Update the last message in the sidebar
      setChats((prevChats) =>
        prevChats.map((c) =>
          c._id === selectedChat._id
            ? { ...c, lastMessage: replyText, lastTimestamp: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 font-sans">
      <div className="flex w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        
        {/* ================= SIDEBAR: Chat List ================= */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Facebook Messages</h2>
            <button 
              onClick={loadChats} 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-2">
            {loadingChats ? (
              <p className="text-center text-gray-500 mt-10">Loading chats...</p>
            ) : chats.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No messages yet.</p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                    selectedChat?._id === chat._id
                      ? "bg-blue-100 border border-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {/* Profile Picture or Initials */}
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
                    {chat.profilePic ? (
                      <img src={chat.profilePic} alt={chat.senderName} className="w-full h-full object-cover" />
                    ) : (
                      chat.senderName.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {chat.senderName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(chat.lastTimestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= MAIN AREA: Message History ================= */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold overflow-hidden">
                  {selectedChat.profilePic ? (
                     <img src={selectedChat.profilePic} alt={selectedChat.senderName} className="w-full h-full object-cover" />
                  ) : (
                     selectedChat.senderName.charAt(0).toUpperCase()
                  )}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{selectedChat.senderName}</h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {loadingMessages ? (
                  <p className="text-center text-gray-500">Loading messages...</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {messages.map((msg, index) => {
                      const isReply = msg.type === "reply";
                      return (
                        <div
                          key={msg._id || index}
                          className={`flex flex-col max-w-[75%] ${
                            isReply ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-2 rounded-2xl ${
                              isReply
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                            }`}
                          >
                            {msg.message}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-1 px-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                    {/* Auto-scroll anchor */}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a reply..."
                  className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className={`px-6 py-3 rounded-full font-semibold text-white transition-colors ${
                    !replyText.trim() || sending
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          ) : (
            // No chat selected state
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800">Your Messages</h3>
                <p className="text-gray-500 mt-1">Select a chat from the sidebar to start messaging.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FacebookChat;