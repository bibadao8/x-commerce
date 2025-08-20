import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history khi mở chat
    useEffect(() => {
        if (isOpen) {
            loadChatHistory();
        }
    }, [isOpen]);

    const loadChatHistory = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat/history`,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );
            
            if (response.data.history.length > 0) {
                setMessages(response.data.history);
            } else {
                // Tin nhắn chào mừng
                setMessages([
                    {
                        role: "assistant",
                        content: "Xin chào! Tôi là trợ lý AI của X-Commerce. Tôi có thể giúp bạn tìm sản phẩm, giải đáp thắc mắc về đơn hàng, thanh toán và nhiều thứ khác. Bạn cần hỗ trợ gì?"
                    }
                ]);
            }
        } catch (error) {
            console.error('Load chat history error:', error);
            setMessages([
                {
                    role: "assistant", 
                    content: "Xin chào! Tôi là trợ lý AI của X-Commerce. Tôi có thể giúp bạn tìm sản phẩm, giải đáp thắc mắc về đơn hàng, thanh toán và nhiều thứ khác. Bạn cần hỗ trợ gì?"
                }
            ]);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        // Thêm tin nhắn user vào chat
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);

        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
                { message: userMessage },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                }
            );

            // Thêm phản hồi AI vào chat
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: response.data.message 
            }]);

        } catch (error) {
            console.error('Send message error:', error);
            toast.error('Không thể gửi tin nhắn. Vui lòng thử lại.');
            
            // Thêm tin nhắn lỗi
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau hoặc liên hệ support qua email: support@x-commerce.com"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = async () => {
        try {
            const token = localStorage.getItem('userToken');
            if (token) {
                await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/chat/history`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }
            
            setMessages([
                {
                    role: "assistant",
                    content: "Xin chào! Tôi là trợ lý AI của X-Commerce. Tôi có thể giúp bạn tìm sản phẩm, giải đáp thắc mắc về đơn hàng, thanh toán và nhiều thứ khác. Bạn cần hỗ trợ gì?"
                }
            ]);
            toast.success('Đã xóa lịch sử chat');
        } catch (error) {
            console.error('Clear chat error:', error);
            toast.error('Không thể xóa lịch sử chat');
        }
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-50"
                title="Chat với AI"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <h3 className="font-semibold">X-Commerce AI Assistant</h3>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={clearChat}
                                className="text-white hover:text-gray-200 transition-colors"
                                title="Xóa lịch sử"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        message.role === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatWidget;