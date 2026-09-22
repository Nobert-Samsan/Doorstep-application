import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const Chat = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Initialize Socket.io
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });
    
    newSocket.on('connect', () => {
      newSocket.emit('join_room', user.id);
    });
    
    setSocket(newSocket);
    return () => newSocket.close();
  }, [user.id]);

  // Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/chat/conversations');
        setConversations(data.data);
      } catch (err) {
        console.error("Failed to load conversations", err);
      }
    };
    fetchConversations();
  }, []);

  // Fetch Messages when Active Chat Changes
  useEffect(() => {
    if (!activeChat) return;
    
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/conversations/${activeChat._id}/messages`);
        setMessages(data.data);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchMessages();
  }, [activeChat]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;
    
    socket.on('receive_message', (message) => {
      if (activeChat && message.conversationId === activeChat._id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      // TODO: Update conversation list lastMessage
    });
    
    return () => socket.off('receive_message');
  }, [socket, activeChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const receiver = activeChat.participants.find(p => p._id !== user.id);

    try {
      const { data } = await api.post(`/chat/conversations/${activeChat._id}/messages`, {
        content: newMessage,
        receiverId: receiver._id
      });
      
      setMessages(prev => [...prev, data.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border bg-gray-50">
          <h2 className="text-lg font-bold text-text-primary">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(chat => {
            const otherUser = chat.participants.find(p => p._id !== user.id);
            return (
              <div 
                key={chat._id} 
                onClick={() => setActiveChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeChat?._id === chat._id ? 'bg-amber-50 border-l-4 border-l-primary' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm text-text-primary">{otherUser?.firstName} {otherUser?.lastName}</h3>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-text-secondary truncate">{chat.lastMessage || 'No messages yet'}</p>
                </div>
              </div>
            );
          })}
          {conversations.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">No conversations yet</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 text-primary font-bold rounded-full flex items-center justify-center">
                  {activeChat.participants.find(p => p._id !== user.id)?.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary">
                    {activeChat.participants.find(p => p._id !== user.id)?.firstName} {activeChat.participants.find(p => p._id !== user.id)?.lastName}
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[70%] shadow-sm ${msg.senderId === user.id ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-gray-200 text-text-primary rounded-tl-none'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-border bg-white flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-secondary transition-colors">
                ➤
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50 text-gray-400">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
