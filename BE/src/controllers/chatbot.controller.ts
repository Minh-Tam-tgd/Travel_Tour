import { Request, Response } from 'express';
import Groq from 'groq-sdk';
import pool from '../config/db';

// Khởi tạo Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'MISSING_API_KEY' });

async function searchToursAndRestaurantsFromDB(userQuery: string) {
  // Lấy danh sách tour và nhà hàng đang hoạt động
  const [tours]: any = await pool.query('SELECT * FROM tours WHERE is_active = 1');
  const [restaurants]: any = await pool.query('SELECT * FROM restaurants WHERE is_active = 1');

  // Thuật toán lọc thô: Trong bối cảnh RAG nhỏ, ta có thể đưa toàn bộ hoặc lọc theo keyword
  // Vì LLM xử lý context window lớn rất tốt, ta có thể trả về tất cả active để AI tự đối chiếu.
  return { tours, restaurants };
}

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Tin nhắn không được trống.' });
      return;
    }

    if (!process.env.GROQ_API_KEY) {
      res.status(500).json({ error: 'Hệ thống chưa được cấu hình khóa GROQ_API_KEY trong .env.' });
      return;
    }

    // 1. Quét Database lấy các tour/nhà hàng liên quan
    const data = await searchToursAndRestaurantsFromDB(message);

    // 2. Định dạng danh sách thành dạng chữ
    let dbContext = "DANH SÁCH TOUR DU LỊCH HIỆN CÓ:\n";
    if (data.tours.length > 0) {
      data.tours.forEach((t: any) => {
        dbContext += `- Tour ID: ${t.id} | Tên: ${t.ten_tour} | Khởi hành: ${t.diem_di} -> Đến: ${t.diem_den} | Giá: ${t.gia_tien} VND | Thời gian: ${t.thoi_gian}\n`;
      });
    } else {
      dbContext += "Hiện không có tour nào đang hoạt động.\n";
    }

    dbContext += "\nDANH SÁCH NHÀ HÀNG HIỆN CÓ:\n";
    if (data.restaurants.length > 0) {
      data.restaurants.forEach((r: any) => {
        dbContext += `- Nhà hàng ID: ${r.id} | Tên: ${r.ten_nha_hang} | Địa chỉ: ${r.dia_chi} | Giá TB: ${r.gia_tien} VND | Mô tả: ${r.mo_ta}\n`;
      });
    } else {
      dbContext += "Hiện không có nhà hàng nào đang hoạt động.\n";
    }

    // 3. Chuẩn bị mảng contents cho Groq
    const systemInstruction = `
      Mày là nhân viên tư vấn du lịch ảo của ND Travel. Nhiệm vụ của mày là chào đón và tư vấn tour du lịch hoặc nhà hàng cho khách.
      Sử dụng kho dữ liệu sau đây để trả lời khách:
      ---
      ${dbContext}
      ---
      QUY TẮC QUAN TRỌNG:
      1. CHỈ tư vấn các tour/nhà hàng có trong danh sách trên. TUYỆT ĐỐI KHÔNG tự bịa địa danh, tour hay mức giá.
      2. Nếu khách hỏi những yêu cầu không có trong danh sách (VD: khách muốn đi leo núi nhưng không có tour leo núi), hãy lịch sự xin lỗi và bảo khách để lại SĐT/Zalo để nhân viên liên hệ hỗ trợ thiết kế lịch trình riêng.
      3. Giọng điệu tư vấn viên: lịch sự, thân thiện, xưng hô "dạ/vâng", "anh/chị", tập trung kích thích khách đặt tour/nhà hàng.
      4. Format số tiền rõ ràng (VD: 5.000.000đ).
      5. CHÚ Ý QUAN TRỌNG: Nếu khách hàng tỏ vẻ thích thú hoặc hỏi chi tiết về một tour nào đó, HOẶC khi mày gợi ý một tour cụ thể, HÃY GỬI KÈM LINK DƯỚI DẠNG HTML ĐỂ KHÁCH CÓ THỂ CLICK VÀO XEM CHI TIẾT.
         Định dạng link bắt buộc phải như sau:
         <a href="chi-tiet-tour.html?id=[ID_CỦA_TOUR]" class="btn btn-sm btn-primary mt-2 mb-2 d-inline-block text-white text-decoration-none" >Xem chi tiết tour [TÊN TOUR]</a>
         (Thay [ID_CỦA_TOUR] và [TÊN TOUR] bằng dữ liệu thực tế).
         tương tự với nhà hàng như sau:
         <a href="nha-hang-chi-tiet.html?id=[ID_CỦA_NHÀ_HÀNG]" class="btn btn-sm btn-primary mt-2 mb-2 d-inline-block text-white text-decoration-none">Xem chi tiết nhà hàng [TÊN_NHÀ_HÀNG]</a>
         (Thay [ID_CỦA_NHÀ_HÀNG] và [TÊN_NHÀ_HÀNG] bằng dữ liệu thực tế).
      6. Trả lời ngắn gọn, súc tích (khoảng 3-4 câu).
    `;

    const groqMessages: any[] = [{ role: 'system', content: systemInstruction }];

    // Chuyển đổi định dạng history của frontend (Gemini format) sang format của Groq
    if (history && history.length > 0) {
      history.forEach((msg: any) => {
        groqMessages.push({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.parts && msg.parts[0] ? msg.parts[0].text : ''
        });
      });
    }

    groqMessages.push({ role: 'user', content: message });

    // 4. Gọi API Groq
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Sử dụng model Llama 3 cực nhanh
      messages: groqMessages,
      temperature: 0.3
    });

    const replyText = response.choices[0]?.message?.content || "";

    // 5. Cập nhật mảng lịch sử (giữ nguyên định dạng cũ để Frontend không bị lỗi)
    const updatedHistory = [
      ...(history || []),
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: replyText }] }
    ];

    res.status(200).json({
      reply: replyText,
      history: updatedHistory
    });

  } catch (error: any) {
    console.error('Lỗi xử lý AI:', error);
    res.status(500).json({ error: 'Lỗi hệ thống chatbot AI: ' + (error.message || JSON.stringify(error)) });
  }
};
