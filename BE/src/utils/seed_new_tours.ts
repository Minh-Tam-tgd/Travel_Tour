import pool from '../config/db';

const rawData = `1	Tour Đà Lạt 3N2Đ	https://www.chunhatviettravel.vn/app-content/uploads/2023/03/da-lat.jpg	Đà Lạt, Lâm Đồng	2025-12-05	3 ngày 2 đêm	2450000	3500000	30	1	Đà Lạt được mệnh danh là “thành phố ngàn hoa” với khí hậu mát mẻ quanh năm và cảnh quan thơ mộng. Hành trình 3N2Đ đưa bạn khám phá hồ Tuyền Lâm yên bình, đồi chè Cầu Đất xanh mướt, cánh đồ...
2	Tour Sa Pa 4N3Đ	https://booking.muongthanh.com/images/news/2025/09/original/dia-diem-du-lich-sapa_1757305579.jpg	Sa Pa, Lào Cai	2025-12-12	4 ngày 3 đêm	3150000	4200000	25	1	Sa Pa sở hữu vẻ đẹp hùng vĩ của núi rừng Tây Bắc và nền văn hóa độc đáo của các dân tộc thiểu số. Tour 4N3Đ mang đến trải nghiệm trekking qua những ruộng bậc thang tuyệt đẹp, khám phá bản Cát...
3	Tour Nha Trang 3N2Đ	https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/shutterstock1269026566-1679399128347.jpg	Nha Trang, Khánh Hòa	2025-11-30	3 ngày 2 đêm	1960000	2800000	30	1	Nha Trang nổi tiếng với những bãi biển trong xanh và hệ sinh thái biển phong phú. Chuyến đi sẽ đưa bạn đến thăm các hòn đảo đẹp nhất vịnh Nha Trang như Hòn Mun, Hòn Tằm để lặn ngắm san hô và tham g...
4	Tour Hội An 2N1Đ	https://cdn11.dienmaycholon.vn/filewebdmclnew/DMCL21/Picture/News/News_expe_12051/12051.png?version=242106	Hội An, Quảng Nam	2025-12-01	2 ngày 1 đêm	1125000	1500000	25	1	Hội An là một trong những đô thị cổ đẹp nhất châu Á với kiến trúc hoài cổ và ánh đèn lồng lung linh về đêm. Tour 2N1Đ đưa bạn dạo quanh phố cổ, check-in các ngôi nhà cổ, chùa Cầu, sông Hoài và t...
5	Tour Phú Quốc 4N3Đ	https://flytime.vn/upload/img/products/08ae65742cda01e85a345a92e2744a2b.gif	Phú Quốc, Kiên Giang	2025-12-20	4 ngày 3 đêm	3900000	5200000	25	1	Phú Quốc – đảo ngọc xinh đẹp – là điểm đến lý tưởng cho những ai yêu biển. Tour 4N3Đ bao gồm tham quan VinWonders, Safari, câu cá – lặn biển ngắm san hô tại Hòn Móng Tay – Hòn Gầm Ghì, tắm biển B...
6	Tour Hạ Long 2N1Đ	https://asiaholiday.com.vn/pic/Tour/tour-du-lich-ha-long-5_1821_HasThumb.jpg	Hạ Long, Quảng Ninh	2025-11-28	2 ngày 1 đêm	1265000	2300000	45	1	Hạ Long – kỳ quan thiên nhiên thế giới – mang vẻ đẹp huyền bí với hàng ngàn đảo đá lớn nhỏ. Tour mang đến cơ hội trải nghiệm du thuyền trên vịnh, tham quan động Thiên Cung – hang Sửng Sốt, chèo...
7	Tour Quy Nhơn 3N2Đ	https://static.vinwonders.com/production/du-lich-quy-nhon-banner.jpg	Quy Nhơn, Bình Định	2025-12-15	3 ngày 2 đêm	1690000	2600000	35	1	Quy Nhơn là điểm đến mới nổi của miền Trung với biển xanh như ngọc và những cung đường ven biển đẹp say đắm. Tour đưa bạn khám phá Eo Gió – địa điểm được mệnh danh là nơi ngắm hoàng hôn đ...
8	Tour Huế 2N1Đ	https://booking.muongthanh.com/upload_images/images/H%60/kham-pha-hue-mong-mo.jpg	Huế, Thừa Thiên Huế	2025-12-03	2 ngày 1 đêm	900000	1800000	50	1	Huế sở hữu vẻ đẹp cổ kính với quần thể di tích cố đô đã được UNESCO công nhận. Tour 2N1Đ đưa bạn khám phá Đại Nội, chùa Thiên Mụ, các lăng tẩm triều Nguyễn và nghe ca Huế trên sông Hương. B...
9	Tour Cần Thơ 2N1Đ	https://booking.muongthanh.com/upload_images/images/Nhung/du-lich-can-tho-1-ngay.jpg	Cần Thơ	2025-12-08	2 ngày 1 đêm	1050000	1400000	25	1	Cần Thơ – trung tâm miền Tây Nam Bộ – mang đến trải nghiệm sông nước đặc trưng. Tour đưa bạn tham quan chợ nổi Cái Răng lúc bình minh, khám phá vườn trái cây trĩu quả, đi đò trên kênh rạch và thư...
10	Tour Mộc Châu 3N2Đ	https://vitracotour.com/wp-content/uploads/2023/12/moc-chau.png	Mộc Châu, Sơn La	2025-12-10	3 ngày 2 đêm	2340000	2600000	10	1	Mộc Châu là cao nguyên xinh đẹp với khí hậu mát mẻ và cảnh sắc thay đổi theo từng mùa. Tour 3N2Đ đưa bạn khám phá đồi chè trái tim, rừng thông Bản Áng, thác Dải Yếm và cầu kính tình yêu. Mùa hoa m...
11	Tour Đà Nẵng – Ngũ Hành Sơn 3N2Đ	https://tourdanangcity.vn/wp-content/uploads/2022/12/thuy-son.jpeg	Đà Nẵng	2025-12-18	3 ngày 2 đêm	2625000	3500000	25	1	Hành trình khám phá thành phố đáng sống nhất Việt Nam. Du khách sẽ được trải nghiệm bãi biển Mỹ Khê tuyệt đẹp, tham quan Ngũ Hành Sơn hùng vĩ và thưởng thức ẩm thực phong phú của miền Trung.
12	Tour Buôn Ma Thuột – Hồ Lắk 2N1Đ	https://dulichviet.com.vn/images/bandidau/du-lich-bu%C3%B4n-ma-thuot-tu-tuc-mua-he-nen-an-gi-di-choi-o-dau.jpg	Đắk Lắk	2025-12-22	2 ngày 1 đêm	1890000	2700000	30	1	Chuyến đi đưa bạn vào không gian Tây Nguyên hoang sơ, nơi tiếng cồng chiêng vang vọng bên làn sương đại ngàn. Tham quan Hồ Lắk thơ mộng, cưỡi voi, nghe sử thi và thưởng thức cà phê nổi tiếng nhất Vi...
13	Tour Đồng Tháp – Tràm Chim 2N1Đ	https://cdnnews.mogi.vn/news/wp-content/uploads/2023/10/14111452/dia-diem-du-lich-dong-thap.jpg	Đồng Tháp	2025-12-08	2 ngày 1 đêm	990000	1800000	45	1	Khám phá Tràm Chim – thiên đường sinh thái miền Tây với hàng trăm loài chim quý hiếm. Du khách được ngồi xuồng len lỏi giữa rừng tràm, ngắm sếu đầu đỏ và trải nghiệm cuộc sống dân dã miền sông...
14	Tour Quảng Bình – Phong Nha 3N2Đ	https://cdn-media.sforum.vn/storage/app/media/ctvseo_MH/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20Qu%E1%BA%A3ng%20B%C3%ACnh/anh-dep-quang-binh-1.jpg	Quảng Bình	2025-12-27	3 ngày 2 đêm	2310000	4200000	45	1	Phong Nha – Kẻ Bàng là kỳ quan thiên nhiên với hệ thống hang động đồ sộ bậc nhất thế giới. Chuyến đi đem đến trải nghiệm độc đáo với hang động kỳ ảo, sông ngầm xanh biếc và rừng nguyên sin...
15	Tour Bến Tre – Cồn Phụng 1N	https://cdn-media.sforum.vn/storage/app/media/ctv_seo4/danh-lam-thang-canh-ben-tre-thumbnail.jpg	Bến Tre	2025-12-14	1 ngày	855000	950000	10	1	Hành trình về xứ dừa Bến Tre, nơi du khách được tham quan làng nghề truyền thống, đi xuồng chèo len lỏi kênh rạch và thưởng thức trái cây miệt vườn. Cồn Phụng nổi bật với cảnh sông nước hữu t...
16	Tour Sơn La – Tà Xùa Săn Mây 3N2Đ	https://booking.muongthanh.com/images/news/2025/03/original/thietkeanh-web_1742279994.jpg	Sơn La	2025-12-30	3 ngày 2 đêm	2720000	3400000	20	1	Tà Xùa nổi tiếng là thiên đường mây, nơi những biển mây bồng bềnh ôm lấy núi non hùng vĩ. Chuyến đi mang lại cảm giác chinh phục đỉnh núi và tận hưởng khoảnh khắc mặt trời mọc đẹp nhất Tây ...
17	Tour Nghệ An – Biển Cửa Lò 2N1Đ	https://statics.vinwonders.com/du-lich-nghe-an_1633921939.jpg	Nghệ An	2026-01-03	2 ngày 1 đêm	1365000	2100000	35	1	Biển Cửa Lò thu hút du khách bởi bãi cát dài, làn nước trong xanh và hải sản tươi ngon. Đây là địa điểm tuyệt vời cho gia đình muốn nghỉ dưỡng và tận hưởng không khí biển yên bình.
18	Tour Vĩnh Long – Cù Lao An Bình 2N1Đ	https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/7/10/hinh-anh-cac-loai-hinh-du-lich-3-1657423025597-1657423027180128362217.jpeg	Vĩnh Long	2025-12-09	2 ngày 1 đêm	1040000	1600000	35	1	Cù Lao An Bình là điểm đến lý tưởng để trải nghiệm cuộc sống miệt vườn chính hiệu. Du khách được tham gia đờn ca tài tử, ăn trái cây tại vườn và du ngoạn bằng ghe trên sông.
19	Tour Bắc Kạn – Hồ Ba Bể 3N2Đ	https://i.ytimg.com/vi/66G-6VnbY2w/maxresdefault.jpg	Bắc Kạn	2025-12-26	3 ngày 2 đêm	2145000	3900000	45	1	Hồ Ba Bể – một trong những hồ nước ngọt tự nhiên đẹp nhất thế giới. Chuyến đi mang đến cảnh quan thơ mộng với núi đá vôi, hang động và thác nước, thích hợp cho người yêu thiên nhiên.
20	Tour Hà Tĩnh – Chùa Hương Tích 1N	https://cdn-media.sforum.vn/storage/app/media/thanhhuyen/%E1%BA%A3nh%20%C4%91%E1%BA%B9p%20h%C3%A0%20t%C4%A9nh/anh-dep-ha-tinh-thumbnail.jpg	Hà Tĩnh	2025-12-21	1 ngày	600000	1200000	50	1	Chùa Hương Tích – ‘Hoan Châu Đệ Nhất Danh Lam’ – là ngôi chùa linh thiêng nằm trên đỉnh núi. Du khách phải đi cáp treo hoặc leo bộ giữa rừng núi xanh mát để đến nơi chiêm bái, mang lại trải nghiệ...`;

const seedNewTours = async () => {
    try {
        console.log('🌱 Đang chuẩn bị cập nhật Database cho Tours...');

        // Thêm cột mo_ta vào bảng tours nếu chưa có
        try {
            await pool.query('ALTER TABLE tours ADD COLUMN mo_ta TEXT;');
            console.log('✅ Đã thêm cột mo_ta vào bảng tours');
        } catch (e: any) {
            console.log('ℹ️ Cột mo_ta có thể đã tồn tại.');
        }

        // Xóa data cũ
        await pool.query('SET FOREIGN_KEY_CHECKS = 0;');
        await pool.query('TRUNCATE TABLE tours;');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('✅ Đã xóa data Tours cũ để nhường chỗ cho data mới');

        const lines = rawData.trim().split('\n');
        
        for (const line of lines) {
            const cols = line.split('\t');
            if (cols.length >= 11) {
                const id = cols[0];
                const ten_tour = cols[1];
                const hinh_anh = cols[2];
                const diem_den = cols[3];
                const diem_di = "Nhiều nơi"; // Data thiếu cột điểm đi
                const ngay_khoi_hanh = cols[4];
                const thoi_gian = cols[5];
                const gia_tien = cols[6];
                const gia_tien_cu = cols[7];
                const phan_tram = cols[8];
                const is_active = cols[9];
                const mo_ta = cols[10];

                await pool.query(`
                    INSERT INTO tours (id, ten_tour, hinh_anh, diem_den, diem_di, ngay_khoi_hanh, thoi_gian, gia_tien, gia_tien_cu, phan_tram, is_active, mo_ta)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [id, ten_tour, hinh_anh, diem_den, diem_di, ngay_khoi_hanh, thoi_gian, gia_tien, gia_tien_cu, phan_tram, is_active, mo_ta]);
            }
        }
        
        console.log(`✅ Đã insert thành công ${lines.length} tours vào database!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi update tours DB:', error);
        process.exit(1);
    }
};

seedNewTours();
