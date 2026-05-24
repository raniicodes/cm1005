# 🍦 Adventure Run
### CM1005 Introduction to Programming I | Final Coursework

**Adventure Run** is a 2D side-scrolling platformer built with **p5.js**. Developed as the capstone project for my introductory programming course, it demonstrates fundamental software engineering principles through a "girly pixelated" aesthetic featuring custom pastel palettes and starry gradients.

## 🚀 Live Demo
[→ Click here to play the game!](https://raniicodes.github.io/adventurerun/)

## 🎮 Gameplay
* **Controls:** Use `W/A/D` or **Arrow Keys-SpaceBar** to move and jump.
* **Objective:** Navigate the platform, collect ice cream cones (+10 pts), and reach the ultimate cupcake (+50 pts) to win.
* **Hazards:** Avoid falling into canyons or colliding with patrolling enemies. You have 3 lives!

## 🛠️ Technical Highlights
This project applies core Computer Science concepts covered in the **CM1005** curriculum:
* **State Management:** A centralized controller manages transitions between `Start`, `Playing`, `Winner`, and `GameOver` states.
* **Object-Oriented Logic:** Implementation of constructor functions to manage autonomous enemy behavior and movement ranges.
* **Camera Systems:** Used `push()`, `pop()`, and `translate()` to create a relative camera that tracks the character across a scrolling environment.
* **Collision Physics:** Geometry-based collision detection for platforms, collectibles, and hazards.
* **Audio Integration:** Real-time triggering of SFX and background music loops using the `p5.sound` library.

## 📂 Project Structure
* `sketch.js` - Main game engine and physics logic.
* `index.html` - Game entry point and library configuration.
* `sounds/` - Directory for all audio assets.

## 📝 About the Project
This repository is part of **PROJECT 012**—a personal initiative to build and deploy 12 distinct projects in one year to document my growth as a developer and student.
As well as my Bsc CS Module's final coursework where I was graded an 88% on my Midterm.

---
*Created as part of the BSc Computer Science curriculum.*
