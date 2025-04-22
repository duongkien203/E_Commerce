import React from "react";
import styles from "../CSS/About.module.css";

function About() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.header}>Về Chúng Tôi</h1>
      <div className={styles.intro}>
        <p>
          Chào mừng bạn đến với EMK Shop! Chúng tôi là cửa hàng thương mại điện
          tử hàng đầu, chuyên cung cấp các sản phẩm chất lượng cao với giá cả
          hợp lý. Với đội ngũ chuyên nghiệp và đam mê, chúng tôi cam kết mang
          đến trải nghiệm mua sắm tuyệt vời cho khách hàng.
        </p>
        <p>
          EMK Shop luôn nỗ lực không ngừng để cải tiến và mở rộng danh mục sản
          phẩm, từ thời trang, điện tử, đến đồ gia dụng và nhiều sản phẩm khác.
          Mục tiêu của chúng tôi là trở thành điểm đến mua sắm đáng tin cậy và
          yêu thích của bạn.
        </p>
      </div>
      <div className={styles.mission}>
        <h2 className={styles.subHeader}>Sứ Mệnh</h2>
        <p>
          Sứ mệnh của chúng tôi là mang lại giá trị tốt nhất cho khách hàng
          thông qua các sản phẩm chất lượng, dịch vụ hoàn hảo và trải nghiệm mua
          sắm thuận tiện. Chúng tôi tin rằng mỗi khách hàng đều xứng đáng nhận
          được sự quan tâm và phục vụ tận tình nhất.
        </p>
      </div>
      <div className={styles.values}>
        <h2 className={styles.subHeader}>Giá Trị Cốt Lõi</h2>
        <ul className={styles.list}>
          <li>Chất lượng: Cam kết cung cấp sản phẩm chất lượng cao.</li>
          <li>Uy tín: Tạo dựng niềm tin và uy tín với khách hàng.</li>
          <li>
            Tận tâm: Phục vụ khách hàng với tất cả tâm huyết và sự tận tâm.
          </li>
          <li>
            Đổi mới: Liên tục cải tiến và đổi mới để mang lại trải nghiệm tốt
            nhất.
          </li>
        </ul>
      </div>
      <div className={styles.team}>
        <h2 className={styles.subHeader}>Đội Ngũ</h2>
        <p>
          EMK Shop tự hào về đội ngũ nhân viên chuyên nghiệp, năng động và đầy
          nhiệt huyết. Chúng tôi luôn đặt khách hàng lên hàng đầu và nỗ lực
          không ngừng để mang đến dịch vụ hoàn hảo nhất.
        </p>
      </div>
      <div className={styles.contact}>
        <h2 className={styles.subHeader}>Liên Hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi hay yêu cầu nào, đừng ngần ngại liên hệ với
          chúng tôi qua Email: minhkien.dhti15a4hn@sv.uneti.edu.vn hoặc qua số
          điện thoại: (+84) 999 999 999.
        </p>
      </div>
    </div>
  );
}

export default About;
