# Space Invaders Game
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📚 Description
A classic Space Invaders game built with JavaScript, HTML, and CSS, running on a Node.js server. The game features enemies to shoot, score tracking, a countdown timer, and a local leaderboard.

## ✨ Features
- **Player Controls**: Move with arrow keys or WASD, shoot with spacebar
- **Limited Resources**: 30 shots maximum per game
- **Countdown Timer**: 60 seconds to achieve victory
- **Lives System**: 3 lives before game over
- **Leaderboard**: Local storage-based leaderboard showing top 10 scores
- **Different Enemy Types**: Regular enemies (10 points) and Death Stars (20 points)

## 💻 Technologies Used

* ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
* ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
* ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
* ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## 📦 Dependencies
- **express**: ^4.18.2 - Web server framework to serve the game
- **compression**: ^1.7.4 - Middleware for compressing HTTP responses
- **nodemon**: ^3.0.1 - Development utility that monitors for changes and restarts server

## 🛠️ File Structure
```
.
├── public/
│   ├── assets/
│   │   └── images/
│   │       ├── chasser1.png
│   │       ├── chasser2.png
│   │       ├── deathStars.png
│   │       └── explosion.png
│   ├── js/
│   │   └── game.js
│   ├── css/
│   │   └── style.css
│   └── index.html
├── server.js
├── package.json
└── README.md
```

## ▶️ How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/Torolgo/SpaceInvaders.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SpaceInvaders
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. Open your browser and go to:
   ```
   http://localhost:8080
   ```

## 🎮 How to Play
- Use arrow keys or WASD to move your ship
- Press the spacebar to shoot (limited to 30 shots per game)
- Destroy enemies to earn points (regular enemies: 10 points, Death Stars: 20 points)
- Reach 200 points before the time runs out to win
- Avoid enemy collisions to preserve your 3 lives

## 👥 Contributors
<a href="https://github.com/Torolgo"><img src="https://avatars.githubusercontent.com/u/190293274?v=4" width="50" alt="Torolgo"></a>
