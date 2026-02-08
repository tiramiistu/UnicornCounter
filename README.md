# Rainbow Counting Adventure

An educational counting game built with HTML5 Canvas where players help a unicorn defeat dragon clusters by identifying the correct number.

## Play Now

**[https://d2clkk504fs9li.cloudfront.net](https://d2clkk504fs9li.cloudfront.net)**

## How to Play

1. A target number appears at the top of the screen
2. Dragon clusters float around, each containing a different number of dragons arranged in dice patterns
3. Find and hit the cluster matching the target number
4. **Desktop**: Aim with your mouse and click to shoot rainbow dust
5. **Mobile**: Tap directly on the correct cluster

### Rules
- **5 lives** per game (shown as hearts)
- **20 seconds** per round
- **2 shots** per round (desktop)
- Correct hits earn points based on remaining time + dragon count
- Wrong answers or running out of time costs a life

## Features

- Unicorn character with rainbow mane and golden horn
- 10 distinct dragon colours so clusters are easy to tell apart
- Dragon groups bounce off screen edges and each other
- Dice-pattern arrangements (1-6 standard, 7-10 as paired dice)
- Victory rainbow animation with heart transformation
- Round feedback messages ("Amazing!", "Well Done!", "Try Again!")
- Difficulty scales with score (3-5 clusters)
- Mobile-optimised with tap-to-select controls
- Installable as a home screen app (PWA)

## Tech Stack

- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** for game logic (no frameworks)
- **CSS3** for UI overlay and animations
- **AWS S3 + CloudFront** for hosting

## Running Locally

Open `index.html` in a browser. No build step or server required.

## Project Structure

```
index.html          - Game page with canvas and UI elements
game.js             - Game logic, classes, and rendering (~970 lines)
style.css           - UI styling, animations, and responsive layout
manifest.json       - Web app manifest for PWA support
icon.svg            - Vector app icon
icon-192.png        - Android home screen icon
icon-512.png        - Android splash icon
apple-touch-icon.png - iOS home screen icon
requirements.md     - Detailed game requirements and specifications
```
