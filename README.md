# SkillSwap Skills Exchange Platform

A skill sharing platform based on Node.js + Express, where users can publish their skills, browse others' skills, favorite interesting skills, and manage their personal profiles.

## 💡 Key Features
- User registration/login system (password encryption, XSS protection)
- AJAX form submission (comments, favorites, etc.)
- MongoDB data management
- Triple validation: client + server + data layer
- Comments, ratings, favorites, skill category browsing
- EJS template rendering + frontend interactive JS
- Complete error handling mechanism

## 🚀 How to Start the Project

## Git Repository
https://github.com/Adityayxt/Stevens-546-FinalProject

## Install Dependencies
npm install

## Create .env File (should already exist)
PORT=3000
MONGODB_URI=mongodb://localhost:27017/skillswap
SESSION_SECRET=your_secret_key

## Start MongoDB
brew services start mongodb-community

## Run Seed File to Add Data
node seed/seed.js

## Start the Project
npm start

## Access the Project
Open http://localhost:3000 in your browser to access the project.

## Github Pages
https://github.com/Adityayxt/Stevens-546-FinalProject
