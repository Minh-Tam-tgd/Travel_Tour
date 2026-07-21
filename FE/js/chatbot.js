(function () {
    const chatCircle = document.getElementById("chat-circle");
    const chatBox = document.getElementById("chat-box-wrapper");
    const chatClose = document.getElementById("chat-box-toggle");
    const chatForm = document.getElementById("chat-submit-form");
    const chatInput = document.getElementById("chat-input");
    const chatLogs = document.getElementById("chat-logs");

    let chatHistory = [];
    try {
        const savedHistory = localStorage.getItem("chatbot_history");
        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory);
        }
    } catch (e) {
        console.error("Lỗi khi load lịch sử chat:", e);
    }

    // ==========================================
    // 1. KIỂM TRA ĐƯỜNG DẪN ĐỂ ẨN CHATBOT 
    // ==========================================
    const currentUrl = window.location.href.toLowerCase();
    
    if (currentUrl.includes("login.html") || currentUrl.includes("register.html") || currentUrl.includes("dashboard.html")) {
        if (chatCircle) chatCircle.style.display = "none";
        if (chatBox) chatBox.style.display = "none";
        return; 
    }

    // ==========================================
    // 2. LOGIC ĐÓNG / MỞ KHUNG CHAT
    // ==========================================
    if (chatCircle && chatBox && chatClose) {
        chatCircle.addEventListener("click", () => {
            chatBox.style.display = "flex";
            chatCircle.style.display = "none";
            
            // Render lịch sử cũ nếu có (chỉ render 1 lần)
            if (chatLogs && chatHistory.length > 0 && !chatBox.dataset.loaded) {
                chatBox.dataset.loaded = "true";
                chatLogs.innerHTML = ""; // Xóa tin nhắn chào mừng mặc định
                chatHistory.forEach(msg => {
                    const sender = msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user';
                    const text = msg.parts && msg.parts[0] ? msg.parts[0].text : msg.content || '';
                    if (text) {
                        appendMessage(text, sender);
                    }
                });
            }
            
            if (chatLogs) chatLogs.scrollTop = chatLogs.scrollHeight; 
        });

        chatClose.addEventListener("click", () => {
            chatBox.style.display = "none";
            chatCircle.style.display = "block";
        });
    }

    // ==========================================
    // 3. XỬ LÝ KHI USER BẤM GỬI TIN NHẮN
    // ==========================================
    if (chatForm && chatInput && chatLogs) {
        chatForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const userMsgText = chatInput.value.trim();
            if (!userMsgText) return; 

            appendMessage(userMsgText, "user");
            chatInput.value = ""; 

            const loadingId = appendMessage("Đang xử lý...", "model");

            try {
                // Gọi API tới server backend Express 
                const response = await fetch("http://127.0.0.1:5000/api/client/chatbot/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: userMsgText,
                        history: chatHistory 
                    })
                });

                const data = await response.json();

                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) loadingElement.remove();

                if (response.ok && data.reply) {
                    appendMessage(data.reply, "model");
                    chatHistory = data.history;
                    localStorage.setItem("chatbot_history", JSON.stringify(chatHistory));
                } else {
                    appendMessage(data.error || "Có chút trục trặc hệ thống rồi, thử lại sau giúp em nhé!", "model");
                }

            } catch (error) {
                console.error("Lỗi kết nối API Chatbot:", error);
                const loadingElement = document.getElementById(loadingId);
                if (loadingElement) loadingElement.remove();
                appendMessage("Không thể kết nối đến máy chủ. Hãy chắc chắn rằng hệ thống đang hoạt động.", "model");
            }
        });
    }

    function appendMessage(text, sender) {
        const msgId = "msg-" + Date.now() + Math.random().toString(36).substr(2, 5);
        const formattedText = text.replace(/\n/g, '<br>');
        
        const msgHtml = `
            <div class="chat-msg ${sender}" id="${msgId}">
                <div class="cm-msg-text">${formattedText}</div>
            </div>
        `;
        
        if (chatLogs) {
            chatLogs.insertAdjacentHTML("beforeend", msgHtml);
            chatLogs.scrollTop = chatLogs.scrollHeight; 
        }
        return msgId;
    }
})();
