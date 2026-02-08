# Rainbow Counting Adventure - Game Requirements

## Game Overview
Rainbow Counting Adventure is a fast-paced educational counting game where players control a unicorn that shoots rainbow dust at groups of dragons. The objective is to identify and hit the correct group of dragons matching a target number before time runs out.

## Core Gameplay

### Player Character
- **Unicorn**: The player controls a magical unicorn that rotates to face the mouse/touch position
- The unicorn remains stationary at the center of the screen
- Features detailed sprite with rainbow mane, golden horn, hooves, and flowing tail
- Horn is angled forward at 25 degrees for visual appeal

### Controls
- **Mouse (Desktop)**: Move mouse to aim, hold down to shoot rainbow dust with auto-fire
- **Touch (Mobile)**: Tap directly on a dragon cluster to select it
- Mobile uses tap-to-select to avoid accidentally hitting wrong clusters en route

### Enemies
- **Dragon Groups**: Groups of 1-10 dragons arranged in dice patterns
- Each group has a distinct colour (purple, red, green, blue, orange, gold, pink, sea green, indigo, slate)
- Groups move together as a single unit across the screen
- Groups bounce off screen edges and off each other to prevent overlapping
- Number of groups increases with score (3-5 groups maximum)

### Shooting Mechanics (Desktop)
- **Rainbow Dust**: Colorful projectiles with glow effects
- Shoots 3 particles in a small spread per shot (one hit registered per shot)
- Limited to 2 shots per round
- Particles have rainbow hue variations and trailing effects

## Game Rules

### Objective
- A target number (1-10) is displayed at the top centre of the screen (behind dragon clusters)
- Player must shoot/tap the dragon group that matches the target number
- Each round has a 20-second time limit

### Scoring System
- **Correct Hit**: Base score = (remaining time in seconds) + (dragon count x 10)
- Score accumulates across rounds
- Higher scores unlock more dragon groups (increased difficulty)

### Lives System
- Player starts with 5 lives (displayed as hearts)
- Lose a life when:
  - Shooting the wrong dragon group and running out of shots
  - Time runs out before hitting the correct group
- Game over when all lives are lost

### Round Progression
1. Dragon groups spawn in circular formation around the centre
2. Target number pops in with scale animation
3. Player has 2 shots and 20 seconds to hit the correct group
4. **Correct hit**: Success message (e.g. "Amazing!", "Well Done!"), rainbow animation, dragons turn into floating hearts, new round starts after 3 seconds
5. **Wrong hit**: Red particle explosion, lose remaining shots if any
6. **Out of shots or time**: Fail message with lives remaining shown, lose a life, new round starts after 2 seconds

### Round Transitions
- Target number pops in at round start, fades out at round end
- Success rounds show random congratulations in bright green
- Failed rounds show "Try Again! X lives left" in red

## Visual Design

### Colour Scheme
- **Primary Purple (#790ECB)**: Target number display, Play Again button, accents
- **Dark Background (#0a0a0a)**: Main background
- **Gradient Background**: Dark purple (#1a0a2e) to black
- **Rainbow Effects**: Full spectrum for mane, dust, and victory animation

### Visual Effects
- **Rainbow Dust**: Colourful particles with glow and shadow effects
- **Victory Rainbow**: Full-screen rainbow arc animation on correct hits
- **Heart Transformation**: Dragons fade into pink hearts that float upward
- **Particle Explosions**: Gold particles on correct hits, red on wrong hits
- **Pop-in Target Number**: Animated scale-up effect at round start
- **Fire Breath**: Animated orange/gold flames from dragon nostrils

### UI Elements
- **Target Number**: Large, centred at top, purple with glow (behind game canvas)
- **Score**: Top right, white text with shadow
- **Timer**: Below score, gold text showing countdown
- **Lives**: Top left, heart emoji display
- **Round Messages**: Centre screen, success (green) or fail (red)
- **Game Over Screen**: Overlay with final score and Play Again button

## Technical Features

### Responsive Design
- Canvas fills entire viewport
- Handles window resize events with unicorn re-centring
- Touch-optimised for mobile devices (tap-to-select)
- Responsive font sizes for smaller screens
- Prevents text selection and default touch behaviours

### Animation & Performance
- 60 FPS target using requestAnimationFrame
- Smooth sprite rotations and movements
- Particle system for visual feedback
- Fade transitions between rounds
- CSS animations for pop-in, fade-out, and message displays

### Dragon Group Patterns
- **1-6 dragons**: Standard dice patterns
- **7-10 dragons**: Two dice side by side (close spacing)
  - 7 = 3 + 4
  - 8 = 4 + 4
  - 9 = 4 + 5
  - 10 = 5 + 5
- 50px spacing within dice, 100px gap between paired dice
- Dragon size is 20px

### Collision Detection
- **Desktop**: Circular collision between rainbow dust and dragons (one hit per shot via shotId tracking)
- **Mobile**: Tap within group bounding radius to select
- Groups bounce off each other using circle-based collision with elastic velocity reflection
- Prevents multiple hits during victory animation

### PWA Support
- Web app manifest for Add to Home Screen
- Apple touch icon (180px) and Android icons (192px, 512px)
- SVG favicon
- Standalone display mode
- Theme colour matching game background

## Game States

### Active Play
- Timer counting down
- Dragons moving and bouncing
- Player can shoot/tap
- Collision detection active

### Victory Animation
- Rainbow arc displays for 1 second
- Dragons transform to hearts
- 2-second fade to black
- New round starts automatically

### Game Over
- Styled overlay with "GAME OVER" title
- Final score displayed
- Play Again button resets score, lives, and game state

## Difficulty Scaling
- **Score 0-49**: 3 dragon groups
- **Score 50-99**: 4 dragon groups
- **Score 100+**: 5 dragon groups (maximum)
- More groups = more choices = harder to identify correct target

## Deployment
- Hosted on AWS S3 with CloudFront CDN
- Static site (HTML, CSS, JS only - no server required)

## Future Enhancement Ideas
- Power-ups (extra time, extra shots, slow motion)
- Different difficulty modes
- Sound effects and background music
- Leaderboard/high score persistence
- Multiple levels with different backgrounds
- Achievement system
- Tutorial/practice mode
