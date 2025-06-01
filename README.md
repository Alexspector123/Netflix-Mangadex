# PHPNetflix 🎬📖

**Enhancing Digital Entertainment Access**
Providing a centralized platform for multimedia consumption is vital. PHPNetflix combines video streaming and manga reading into a single service, enabling users to enjoy diverse content without switching between platforms. By offering both anime-style videos and manga, the platform appeals to a broad audience—especially Gen Z and pop culture enthusiasts.
**Improving User Engagement & Retention**
User experience is a key competitive edge for any entertainment platform. PHPNetflix focuses on personalized recommendations, watch/resume tracking, manga bookmarks, and intuitive content categorization. Features like “continue watching” and “continue reading” increase session times and retention, while ensuring seamless transitions between films and manga.
**Streamlining Multimedia Content Delivery**
Fast, secure, and reliable streaming and reading are essential. PHPNetflix leverages CDNs, image compression, lazy loading, and adaptive bitrate streaming to minimize buffering and load times—especially on mobile devices or slower networks—improving customer satisfaction and credibility.
**Expanding the Platform’s Market Reach**
By catering to both video consumers and manga readers, PHPNetflix addresses two overlapping markets. Multi-language support, a responsive design for all devices, and search engine optimization (SEO) enhance discoverability and drive market expansion.
**Providing Personalization & User-Centric Features**
Build robust user profiles with preferences, favorite lists, and content history. Smart suggestions ensure a tailored entertainment experience, making users feel the platform truly understands them—boosting loyalty and stickiness.
**Ensuring Secure & Scalable Infrastructure**
Security is critical, especially for account management. PHPNetflix implements JWT authentication, role-based access control, and encrypted user data. Cloud scalability handles high volumes of concurrent users during peak times.
**Promoting Content Discovery and Creator Ecosystem**
Encourage indie creators, translators, and uploaders to contribute manga and video content, fostering a mini ecosystem. Features like upload portals, content moderation, and community voting support this goal.

---

## Table of Contents
* [Features](#features-✨)
* [Tech Stack](#tech-stack-🛠️)
* [Installation](#installation-🚀)
* [Usage](#usage-🎉)
* [Contributing](#contributing-🙌)
* [License](#license-📄)
* [Contact](#contact-🤝)

---

## Features ✨
* **Smooth Sign-Up & Login**
  * Quick registration and secure JWT-based login.
  * Role-based access: Regular users vs. VIP members.
* **Explore Videos & Manga**
  * Browse or search the entire catalog.
  * Video “resume” so users never lose their spot.
  * Manga reader with bookmarks and lazy-loading for fast page turns.
* **Favorites & History**
  * VIP users can mark any video or manga as a favorite.
  * Automatic tracking of watch and read history.
* **VIP Perks**
  * Enjoy an ad-free experience.
  * Upload your own manga series and chapters (Cloudinary-powered!).
  * Easy subscription management via Stripe.
* **Admin Dashboard**
  * Manage users (promote to VIP, deactivate, etc.).
  * Approve or reject new manga uploads.
  * View simple analytics and system logs.

---

## Tech Stack 🛠️
### Backend
* **Node.js (v16+) & Express.js**
* **Sequelize ORM** for MySQL
* **Mongoose** for select MongoDB collections
### Media & Uploads
* **Cloudinary** (with `multer-storage-cloudinary`)
* **multer** for handling file uploads
### Auth & Security
* **jsonwebtoken** + **bcryptjs** for secure authentication
* **express-rate-limit**, **helmet**, **cors** to protect APIs
### Caching & Throttling
* **Bottleneck** to manage API request rates
### Utilities
* **axios** for HTTP requests
* **cookie-parser** for cookie handling
* **dotenv** for environment variables

---

## Installation 🚀
Follow these steps to set up PHPNetflix on your machine:
1. **Clone the repository**
   ```bash
   git clone https://github.com/Alexspector123/PHPNetflix.git
   cd PHPNetflix
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Create a `.env` file in the project root with the following content:
   ```env
   # Application
   PORT=3000
   # MySQL (Sequelize)
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASS=your_mysql_password
   DB_NAME=phpnetflix_db
   # MongoDB (if used)
   MONGO_URI=mongodb://localhost:27017/phpnetflix
   # JWT
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret
   ```
4. **Prepare the databases**
   * **MySQL**
     1. Start your MySQL server.
     2. Create a database named `phpnetflix_db`.
     3. Run any available migrations (if using Sequelize CLI).
   * **MongoDB**
     * Ensure your MongoDB instance is running if you need it for certain collections (e.g., upload logs).
5. **Start the application**
   * For gateway development (with auto-reload):
     ```bash
     npm run dev
     ```
   * For movie production:
     ```bash
     npm run start1
     ```
   * For manga production:
     ```bash
     npm run start2
     ```
   * Frontend (if separated):
     ```bash
     cd frontend
     npm install
     npm run dev
     ```

---

## Usage 🎉
1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new account or log in with existing credentials.
3. Explore the video and manga catalog, add favorites, and track your history.
4. VIP users can enjoy ad-free content and upload their own manga.

---

## Contributing 🙌
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit: `git commit -m "Add your message here"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request describing your changes.
Please adhere to the existing coding style and write clear, descriptive commit messages.

---

## License 📄
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact 🤝
* **Project Repository:** [https://github.com/Alexspector123/PHPNetflix](https://github.com/Alexspector123/PHPNetflix)
* **Project drive:** Finantasy Web Project Report ((https://drive.google.com/drive/folders/1dxbe7CGuoiGvInFQXA26lc_PvybXgeMC?fbclid=IwY2xjawKpMIhleHRuA2FlbQIxMABicmlkETFTejMwbUp5bmRkcHgzT0JjAR7lXRcPvnTmjRA8V8nW4uU3z1AdgFwVxe00Mkg8pPAhHPmHzXoK-kSLGXxEFQ_aem_OBx9xAOt0unpHJjTFnCnbg))
Feel free to open issues or reach out with questions and suggestions.
