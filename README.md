# One_Earth_One_Family

![License](https://img.shields.io/badge/license-ISC-green)

## 📝 Description

In an era defined by division, One Earth, One Family emerges as a beacon of unity, built on the robust foundation of Express.js. This web platform transcends geographical boundaries and cultural differences, fostering a sense of interconnectedness among all people. Envisioned as a digital representation of our shared home within the vast cosmos, the platform provides a space to break down barriers, cultivate understanding, and celebrate our collective humanity. Experience the power of connection and contribute to a world where we recognize ourselves as one global family, sharing a single Earth.

## ✨ Features

- 🕸️ Web


## 🛠️ Tech Stack

- 🚀 Express.js


## 📦 Key Dependencies

```
axios: ^1.4.0
bcrypt: ^5.1.1
body-parser: ^1.20.3
cors: ^2.8.5
dotenv: ^16.4.7
ejs: ^3.1.10
express: ^4.21.2
express-session: ^1.18.1
formidable: ^3.5.2
fs: ^0.0.1-security
jsonwebtoken: ^9.0.2
mongoose: ^8.9.5
multer: ^1.4.5-lts.1
nodemailer: ^6.9.16
uuid: ^11.0.3
```

## 🚀 Run Commands

- **test**: `npm run test`
- **start**: `npm run start`


## 📁 Project Structure

```
.
├── bgimage.jpeg
├── guser.jpeg
├── middleware
│   └── authenticateJWT.js
├── models
│   ├── Profiles.js
│   ├── Thought.js
│   └── User.js
├── ngk_spacehub3_2_3x2.PNG
├── package.json
├── pic1.jpg
├── pic2.jpg
├── public
│   ├── assets
│   │   ├── css
│   │   │   ├── index.css
│   │   │   ├── main.css
│   │   │   ├── ngk_spacehub3_2_3x2.PNG
│   │   │   └── pic1.jpg
│   │   ├── img
│   │   │   ├── 1741097400585.png
│   │   │   ├── Our_Gallery
│   │   │   │   ├── Daily_life
│   │   │   │   │   ├── d1.jpg
│   │   │   │   │   ├── d10.jpg
│   │   │   │   │   ├── d2.jpg
│   │   │   │   │   ├── d3.jpg
│   │   │   │   │   ├── d4.jpg
│   │   │   │   │   ├── d5.jpg
│   │   │   │   │   ├── d6.jpg
│   │   │   │   │   ├── d7.jpg
│   │   │   │   │   ├── d8.jpg
│   │   │   │   │   └── d9.jpg
│   │   │   │   ├── food
│   │   │   │   │   ├── f1.jpg
│   │   │   │   │   ├── f2.jpg
│   │   │   │   │   ├── f3.jpg
│   │   │   │   │   ├── f4.jpg
│   │   │   │   │   ├── f5.jpg
│   │   │   │   │   ├── f6.jpg
│   │   │   │   │   ├── f7.jpg
│   │   │   │   │   └── f8.jpg
│   │   │   │   └── nature
│   │   │   │       ├── n1.jpg
│   │   │   │       ├── n2.jpg
│   │   │   │       ├── n3.jpg
│   │   │   │       ├── n4.jpg
│   │   │   │       ├── n5.jpg
│   │   │   │       ├── n6.jpg
│   │   │   │       ├── n7.jpg
│   │   │   │       ├── n8.jpg
│   │   │   │       └── n9.jpg
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── blog
│   │   │   │   ├── blog-02.jpg
│   │   │   │   ├── blog-03.jpg
│   │   │   │   ├── blog-1.jpg
│   │   │   │   ├── blog-2.jpg
│   │   │   │   ├── blog-3.jpg
│   │   │   │   ├── blog-4.jpg
│   │   │   │   ├── blog-5.jpg
│   │   │   │   ├── blog-6.jpg
│   │   │   │   ├── blog-author-2.jpg
│   │   │   │   ├── blog-author-3.jpg
│   │   │   │   ├── blog-author-4.jpg
│   │   │   │   ├── blog-author-5.jpg
│   │   │   │   ├── blog-author-6.jpg
│   │   │   │   ├── blog-author.jpg
│   │   │   │   ├── blog-inside-post.jpg
│   │   │   │   ├── comments-1.jpg
│   │   │   │   ├── comments-2.jpg
│   │   │   │   ├── comments-3.jpg
│   │   │   │   ├── comments-4.jpg
│   │   │   │   ├── comments-5.jpg
│   │   │   │   └── comments-6.jpg
│   │   │   ├── favicon.png
│   │   │   ├── favicon_OEOF.jpg
│   │   │   ├── friends.jpg
│   │   │   ├── masonry-portfolio
│   │   │   │   ├── masonry-portfolio-1.jpg
│   │   │   │   ├── masonry-portfolio-2.jpg
│   │   │   │   ├── masonry-portfolio-3.jpg
│   │   │   │   ├── masonry-portfolio-4.jpg
│   │   │   │   ├── masonry-portfolio-5.jpg
│   │   │   │   ├── masonry-portfolio-6.jpg
│   │   │   │   ├── masonry-portfolio-7.jpg
│   │   │   │   ├── masonry-portfolio-8.jpg
│   │   │   │   └── masonry-portfolio-9.jpg
│   │   │   ├── ngk_spacehub3_2_3x2.PNG
│   │   │   ├── pic1.jpg
│   │   │   ├── portfolio
│   │   │   │   ├── app-1.jpg
│   │   │   │   ├── books-1.jpg
│   │   │   │   ├── branding-1.jpg
│   │   │   │   └── product-1.jpg
│   │   │   ├── services.jpg
│   │   │   ├── team
│   │   │   │   ├── 1741097449292.png
│   │   │   │   ├── 1741097735839.png
│   │   │   │   ├── 1741098195993.jpg
│   │   │   │   ├── 1741098257573.jpg
│   │   │   │   ├── 1741098319169.jpg
│   │   │   │   ├── 1741098371437.jpg
│   │   │   │   ├── 1741098429743.jpg
│   │   │   │   ├── 1741098786071.jpg
│   │   │   │   ├── 1741098798416.jpg
│   │   │   │   ├── 1741098804447.jpg
│   │   │   │   ├── 1741098857303.jpg
│   │   │   │   ├── 1741098959634.jpg
│   │   │   │   ├── 1741099129567.jpg
│   │   │   │   ├── 1741099260667.jpg
│   │   │   │   ├── 1741099296182.jpg
│   │   │   │   ├── 1741100157303.jpg
│   │   │   │   ├── 1742386157512.png
│   │   │   │   ├── 1746614270931.png
│   │   │   │   ├── Noa schindler.jpg
│   │   │   │   ├── charlotte.jpg
│   │   │   │   ├── dima.jpg
│   │   │   │   ├── eric.jpg
│   │   │   │   ├── irina.jpg
│   │   │   │   ├── kart-issac.jpg
│   │   │   │   ├── lavi.jpg
│   │   │   │   ├── lubochka.jpg
│   │   │   │   ├── maskim.jpg
│   │   │   │   ├── neer.jpg
│   │   │   │   ├── nour.jpg
│   │   │   │   └── shah.jpg
│   │   │   ├── testimonials
│   │   │   │   ├── testimonials-1.jpg
│   │   │   │   ├── testimonials-2.jpg
│   │   │   │   ├── testimonials-3.jpg
│   │   │   │   ├── testimonials-4.jpg
│   │   │   │   └── testimonials-5.jpg
│   │   │   ├── universe
│   │   │   │   ├── earth_from_space.jpg
│   │   │   │   ├── galaxy.jpg
│   │   │   │   ├── human_hands.jpg
│   │   │   │   └── multiverse.jpg
│   │   │   ├── working-1.jpg
│   │   │   ├── working-2.jpg
│   │   │   ├── working-3.jpg
│   │   │   └── working-4.jpg
│   │   ├── js
│   │   │   └── main.js
│   │   └── scss
│   │       └── Readme.txt
│   ├── google3634443e1c428dc1.html
│   ├── img
│   │   ├── 1739604385415.png
│   │   ├── 1739606017600.png
│   │   ├── 1739606440317.png
│   │   ├── 1739606826281.png
│   │   ├── 1739607597095.png
│   │   ├── 1739608071304.png
│   │   ├── 1739608667023.png
│   │   ├── 1739613625118.png
│   │   ├── 1739613782483.png
│   │   ├── 1739613915550.png
│   │   ├── 1739614435258.png
│   │   ├── 1739615282651.png
│   │   ├── 1739616933241.png
│   │   ├── 1739622498317.png
│   │   ├── 1739623294778.png
│   │   ├── 1739623485213.png
│   │   ├── 1739623577523.png
│   │   ├── 1739624203896.png
│   │   ├── 1739624455426.png
│   │   ├── 1739624576715.png
│   │   ├── 1741095704349.png
│   │   ├── 1741096093289.png
│   │   ├── 1741096148630.png
│   │   ├── 1741096326750.png
│   │   ├── 1741096498456.png
│   │   ├── 1741097267970.png
│   │   ├── favicon_OEOF.jpg
│   │   └── image.png
│   ├── index.html
│   ├── index.js
│   └── signup.css
├── public copy
│   ├── contact.html
│   ├── dashboard.html
│   ├── index.js
│   ├── profile.html
│   └── signup.ejs
├── routes
│   └── thoughts.js
├── server.js
├── test.html
├── vercel.json
├── views
│   ├── dashboards.ejs
│   ├── edit-details.ejs
│   ├── image.png
│   ├── index_form.ejs
│   ├── login.ejs
│   ├── profileList.ejs
│   ├── signup.ejs
│   ├── userProfile.ejs
│   └── userProfilee.ejs
└── website.png
```

## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/Nee-sudo/One_Earth_One_Family.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.

## 📜 License

This project is licensed under the ISC License.

---
*This README was generated with ❤️ by ReadmeBuddy*
