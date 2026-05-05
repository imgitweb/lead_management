import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, RefreshCw, MessageSquare, Bot, UserCircle, ArrowLeft } from "lucide-react";
import { fetchWaChats, fetchWaMessages, sendWaReply, toggleWaBotStatus } from "../../services/whatsappApi";
import Button from "../../components/UI/Button";
import { useToast } from "../../components/UI/Toast";
import Breadcrumb from "../../components/UI/Breadcrumb";
import { theme } from "../../theme/constants";

const WhatsappChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Bot Toggle State
  const [isBotActive, setIsBotActive] = useState(true);
  const [toggling, setToggling] = useState(false);

  const messagesEndRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = async () => {
    setLoadingChats(true);
    try {
      const data = await fetchWaChats();
      setChats(data);
    } catch (error) {
      toast.error("Error", "Failed to load WhatsApp chats");
    } finally {
      setLoadingChats(false);
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    setLoadingMessages(true);
    try {
      const response = await fetchWaMessages(chat._id);
      
      // Handle both formats (if backend returns array or { messages, isBotEnabled })
      const chatMessages = response.messages ? response.messages : response;
      setMessages(chatMessages);
      
      // Update bot toggle state based on backend data (default to true if undefined)
      setIsBotActive(response.isBotEnabled !== undefined ? response.isBotEnabled : true);
      
    } catch (error) {
      toast.error("Error", "Failed to load message history");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleToggleBot = async () => {
    if (!selectedChat) return;
    setToggling(true);
    try {
      const newStatus = !isBotActive;
      await toggleWaBotStatus(selectedChat._id, newStatus);
      setIsBotActive(newStatus);
      
      // Sidebar me bhi indicator (Red/Green dot) update karein
      setChats(prevChats => 
        prevChats.map(c => 
          c._id === selectedChat._id ? { ...c, isBotEnabled: newStatus } : c
        )
      );

      toast.success("Bot Updated", `AI Auto-Reply is now ${newStatus ? 'ON' : 'OFF'}`);
    } catch (error) {
      toast.error("Error", "Failed to change bot status.");
    } finally {
      setToggling(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    setSending(true);
    try {
      // 🔥 FIX: "Admin" ki jagah user ka actual naam pass karein
      const response = await sendWaReply(
        selectedChat._id,
        replyText,
        selectedChat.senderName || selectedChat._id // Agar naam nahi hai toh number bhej dega
      );

      setMessages((prev) => [...prev, response.reply]);
      setReplyText("");

      setChats((prevChats) =>
        prevChats.map((c) =>
          c._id === selectedChat._id
            ? { ...c, lastMessage: replyText, lastTimestamp: new Date().toISOString() }
            : c
        )
      );
    } catch (error) {
      toast.error("Error", "Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    // MAIN CONTAINER - Adjusted padding for mobile to maximize space
    <div 
      className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)]  font-sans box-border"
      style={{ backgroundColor: theme.pageBg }}
    >
      {/* Top Header & Breadcrumb - Hidden on mobile if a chat is selected to save space */}
      <div className={`flex-shrink-0 mb-2 md:mb-4 ${selectedChat ? 'hidden md:block' : 'block'}`}>
        <Breadcrumb items={[{ label: 'Dashboard', path: '/' }, { label: 'WhatsApp' }]} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: theme.textPrimary, margin: 0 }}>
            WhatsApp
          </h1>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} /> <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
      </div>

      {/* CHAT WRAPPER */}
      <div 
        className="flex-1 min-h-0 flex w-full max-w-7xl mx-auto overflow-hidden rounded-md shadow-lg"
        style={{ 
          backgroundColor: theme.cardBg, 
          border: `1px solid ${theme.cardBorder}` 
        }}
      >
        
        {/* ================= SIDEBAR: Chat List ================= */}
        {/* Hidden on mobile if a chat is selected. Takes full width on mobile, 1/3 on desktop. */}
        <div 
          className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 md:min-w-[320px] flex-col border-r`}
          style={{ 
            backgroundColor: theme.tableHeaderBg,
            borderColor: theme.cardBorder 
          }}
        >
          <div 
            className="p-4 md:p-5 flex items-center justify-between border-b shrink-0"
            style={{ 
              backgroundColor: theme.cardBg,
              borderColor: theme.cardBorder 
            }}
          >
            <h2 className="text-xl font-bold m-0 flex items-center gap-2" style={{ color: theme.textPrimary }}>
              <MessageSquare size={22} style={{ color: theme.primary }} /> Chats
            </h2>
            <Button 
              variant="outline" 
              onClick={loadChats} 
              style={{ padding: '6px 12px', height: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}
            >
              <RefreshCw size={14} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 md:p-3">
            {loadingChats ? (
              <p className="text-center mt-10 text-sm" style={{ color: theme.textMuted }}>Loading chats...</p>
            ) : chats.length === 0 ? (
              <p className="text-center mt-10 text-sm" style={{ color: theme.textMuted }}>No messages yet.</p>
            ) : (
              chats.map((chat) => {
                const isSelected = selectedChat?._id === chat._id;
                return (
                  <motion.div
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 transition-all duration-200"
                    style={{
                      backgroundColor: isSelected ? theme.primaryLight : 'transparent',
                      border: isSelected ? `1px solid ${theme.primaryBorder}` : '1px solid transparent',
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-lg font-bold shadow-sm relative"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})`,
                        color: '#fff' 
                      }}
                    >
                      {chat.senderName.charAt(0).toUpperCase()}
                      
                      {/* Visual Indicator: Green Dot = Bot Active, Red Dot = Bot Paused */}
                      <span 
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                        style={{ backgroundColor: chat.isBotEnabled !== false ? theme.success : theme.error }}
                        title={chat.isBotEnabled !== false ? "Bot Active" : "Human Mode"}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-semibold m-0 truncate" style={{ color: theme.textPrimary }}>
                          {chat.senderName}
                        </h3>
                        <span className="text-[11px] shrink-0" style={{ color: theme.textLight }}>
                          {new Date(chat.lastTimestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs m-0 truncate" style={{ color: theme.textSecondary }}>
                        {chat.lastMessage}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= MAIN AREA: Message History ================= */}
        {/* Hidden on mobile if NO chat is selected. Takes full width. */}
        <div 
          className={`${!selectedChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col min-w-0 w-full`} 
          style={{ backgroundColor: theme.cardBg }}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div 
                className="p-3 md:p-4 flex items-center justify-between border-b shrink-0"
                style={{ 
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder 
                }}
              >
                <div className="flex items-center gap-2 md:gap-4 min-w-0">
                  {/* MOBILE BACK BUTTON (Visible only on mobile) */}
                  <button 
                    className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setSelectedChat(null)}
                    style={{ color: theme.textPrimary }}
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div 
                    className="w-10 h-10 md:w-11 md:h-11 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-base md:text-lg font-bold"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})`,
                      color: '#fff' 
                    }}
                  >
                    {selectedChat.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <h2 className="text-base md:text-lg font-bold m-0 truncate" style={{ color: theme.textPrimary }}>
                      {selectedChat.senderName}
                    </h2>
                    <span className="text-[10px] md:text-xs truncate block" style={{ color: theme.textLight }}>
                      {selectedChat._id}
                    </span>
                  </div>
                </div>

                {/* --- AI BOT TOGGLE SWITCH --- */}
                <div className="flex items-center gap-2 md:gap-3 bg-gray-50 px-2 py-1.5 md:px-4 md:py-2 rounded-lg border shrink-0" style={{ borderColor: theme.cardBorder }}>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    {isBotActive ? <Bot size={16} style={{ color: theme.success }} /> : <UserCircle size={16} style={{ color: theme.warning }} />}
                    <span className="text-xs md:text-sm font-semibold hidden sm:inline" style={{ color: theme.textSecondary }}>
                      {isBotActive ? "AI Auto-Reply" : "Manual Mode"}
                    </span>
                  </div>
                  
                  {/* Tailwind Toggle Implementation */}
                  <button 
                    onClick={handleToggleBot}
                    disabled={toggling}
                    className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors focus:outline-none ${toggling ? 'opacity-50' : 'opacity-100'}`}
                    style={{ backgroundColor: isBotActive ? theme.primary : '#ccc' }}
                  >
                    <span 
                      className={`inline-block h-3.5 w-3.5 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${isBotActive ? 'translate-x-5 md:translate-x-6' : 'translate-x-1'}`} 
                    />
                  </button>
                </div>
                {/* ----------------------------- */}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6" style={{ backgroundColor: theme.pageBg }}>
                {loadingMessages ? (
                  <p className="text-center text-sm" style={{ color: theme.textMuted }}>Loading messages...</p>
                ) : (
                  <div className="flex flex-col gap-3 md:gap-4">
                    {messages.map((msg, index) => {
                      const isReply = msg.type === "reply";
                      const isBotMessage = msg.senderName === "AI Assistant";
                      
                      return (
                        <div
                          key={msg._id || index}
                          className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isReply ? 'self-end items-end' : 'self-start items-start'}`}
                        >
                          <div 
                            className="px-3 py-2 md:px-4 md:py-3 text-sm shadow-sm break-words w-full"
                            style={{
                              backgroundColor: isReply ? theme.primary : theme.cardBg,
                              color: isReply ? '#fff' : theme.textPrimary,
                              border: isReply ? 'none' : `1px solid ${theme.cardBorder}`,
                              borderRadius: 18,
                              borderBottomRightRadius: isReply ? 4 : 18,
                              borderBottomLeftRadius: isReply ? 18 : 4,
                            }}
                          >
                            {msg.message}
                          </div>
                          <span className="text-[10px] mt-1 px-1 flex items-center gap-1" style={{ color: theme.textLight }}>
                            {isBotMessage && <Bot size={10} />}
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input Area */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-3 md:p-5 flex items-center gap-2 md:gap-3 border-t shrink-0"
                style={{ 
                  backgroundColor: theme.cardBg,
                  borderColor: theme.cardBorder 
                }}
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isBotActive ? "Switch to Manual Mode to reply..." : "Type a message..."}
                  disabled={sending || isBotActive}
                  className="flex-1 h-10 md:h-12 rounded-full px-4 md:px-5 text-sm outline-none transition-all duration-200"
                  style={{
                    backgroundColor: isBotActive ? theme.pageBg : theme.inputBg,
                    border: `1px solid ${theme.inputBorder}`,
                    color: theme.inputText,
                    opacity: isBotActive ? 0.6 : 1,
                    cursor: isBotActive ? 'not-allowed' : 'text'
                  }}
                  onFocus={(e) => e.target.style.border = `1px solid ${theme.primary}`}
                  onBlur={(e) => e.target.style.border = `1px solid ${theme.inputBorder}`}
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!replyText.trim() || sending || isBotActive}
                  style={{
                    height: window.innerWidth < 768 ? 40 : 48,
                    width: window.innerWidth < 768 && (!replyText.trim() && !sending) ? 40 : 'auto', // Circular button on mobile if empty
                    padding: window.innerWidth < 768 && (!replyText.trim() && !sending) ? '0' : '0 20px',
                    borderRadius: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    fontWeight: theme.fontWeightSemiBold,
                    opacity: (!replyText.trim() || sending || isBotActive) ? 0.6 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span className="hidden sm:inline">
                    {sending ? "Sending..." : "Send"}
                  </span>
                  {!sending && <Send size={16} className="sm:ml-1" />}
                </Button>
              </form>
            </>
          ) : (
            // No chat selected state (Visible only on Desktop)
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-6" style={{ backgroundColor: theme.pageBg }}>
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ backgroundColor: theme.primaryLight }}
              >
                <MessageSquare size={40} style={{ color: theme.primary }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: theme.textPrimary }}>
                WhatsApp Dashboard
              </h3>
              <p className="text-sm m-0" style={{ color: theme.textSecondary }}>
                Select a contact from the sidebar to view history or toggle AI Bot.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WhatsappChat;