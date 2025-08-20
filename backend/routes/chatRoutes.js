const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Khởi tạo Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Lưu trữ lịch sử chat (trong production nên dùng database)
const chatHistory = new Map();

// Middleware để lấy user ID từ token
const getUserFromToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    
    try {
        // Giả sử bạn có JWT decode function
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // return decoded.userId;
        return 'user_' + Date.now(); // Tạm thời dùng timestamp
    } catch (error) {
        return null;
    }
};

// POST /api/chat - Gửi tin nhắn
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        const userId = getUserFromToken(req) || 'guest_' + Date.now();
        
        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Lấy lịch sử chat của user
        if (!chatHistory.has(userId)) {
            chatHistory.set(userId, []);
        }
        const userHistory = chatHistory.get(userId);

        // Tạo system prompt cho AI
        const systemPrompt = `Bạn là trợ lý AI của X-Commerce, một cửa hàng thời trang online. 
        Nhiệm vụ của bạn:
        - Trả lời câu hỏi về sản phẩm, đơn hàng, thanh toán, vận chuyển
        - Hướng dẫn khách hàng sử dụng website
        - Giải đáp thắc mắc về chính sách đổi trả, bảo hành
        - Đề xuất sản phẩm phù hợp
        - Luôn lịch sự, thân thiện và hữu ích
        - Trả lời bằng tiếng Việt
        
        Nếu khách hỏi về thông tin cụ thể (đơn hàng, tài khoản), hướng dẫn họ liên hệ support hoặc đăng nhập để xem.`;

        // Khởi tạo model Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Tạo chat session
        const chat = model.startChat({
            history: userHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        // Gửi tin nhắn với system prompt
        const result = await chat.sendMessage([
            systemPrompt,
            message
        ]);

        const aiResponse = result.response.text();

        // Lưu tin nhắn vào lịch sử
        userHistory.push(
            { role: "user", content: message },
            { role: "assistant", content: aiResponse }
        );

        // Giới hạn lịch sử (giữ 20 tin nhắn)
        if (userHistory.length > 20) {
            userHistory.splice(0, userHistory.length - 20);
        }

        res.json({
            message: aiResponse,
            timestamp: new Date().toISOString(),
            userId: userId
        });

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ 
            error: "Có lỗi xảy ra, vui lòng thử lại sau",
            message: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể thử lại sau hoặc liên hệ support qua email: support@x-commerce.com"
        });
    }
});

// GET /api/chat/history - Lấy lịch sử chat
router.get("/history", (req, res) => {
    try {
        const userId = getUserFromToken(req) || 'guest_' + Date.now();
        const userHistory = chatHistory.get(userId) || [];
        
        res.json({
            history: userHistory,
            userId: userId
        });
    } catch (error) {
        console.error("Get chat history error:", error);
        res.status(500).json({ error: "Không thể lấy lịch sử chat" });
    }
});

// DELETE /api/chat/history - Xóa lịch sử chat
router.delete("/history", (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (userId && chatHistory.has(userId)) {
            chatHistory.delete(userId);
        }
        res.json({ message: "Đã xóa lịch sử chat" });
    } catch (error) {
        console.error("Delete chat history error:", error);
        res.status(500).json({ error: "Không thể xóa lịch sử chat" });
    }
});

module.exports = router;