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
- **Mouse**: Move mouse to aim, hold down to shoot rainbow dust
- **Touch**: Touch and drag to aim, hold to shoot (mobile-friendly)
- **Auto-fire**: Continuous shooting while mouse/touch is held down with cooldown between shots

### Enemies
- **Dragon Groups**: Groups of 1-10 dragons arranged in dice patterns
- Dragons are purple with red eyes, horns, and animated fire breath
- Groups move together as a single unit across the screen
- Groups bounce off screen edges to stay visible
- Number of groups increases with score (3-5 groups maximum)

### Shooting Mechanics
- **Rainbow Dust**: Colorful projectiles with glow effects
- Shoots 3 particles in a small spread for better hit detection
- Limited to 2 shots per round
- Particles have rainbow hue variations and trailing effects

## Game Rules

### Objective
- A target number (1-10) is displayed at the top center of the screen
- Player must shoot the dragon group that matches the target number
- Each round has a 10-second time limit

### Scoring System
- **Correct Hit**: Base score = (remaining time in seconds) + (dragon count × 10)
- Score accumulates across rounds
- Higher scores unlock more dragon groups (increased difficulty)

### Lives System
- Player starts with 3 lives (displayed as hearts)
- Lose a life when:
  - Shooting the wrong dragon group and running out of shots
  - Time runs out before hitting the correct group
- Game over when all lives are lost

### Round Progression
1. Dragon groups spawn in circular formation around the center
2. Target number is randomly selected from available groups
3. Player has 2 shots and 10 seconds to hit the correct group
4. **Correct hit**: Rainbow animation plays, dragons turn into floating hearts, new round starts after 3 seconds
5. **Wrong hit**: Red particle explosion, lose remaining shots if any
6. **Out of shots or time**: Lose a life, new round starts after 1 second

## Visual Design

### Color Scheme (Kiro Brand Colors)
- **Primary Purple (#790ECB)**: Target number display, accents
- **Dark Background (#0a0a0a)**: Main background
- **Gradient Background**: Dark purple (#1a0a2e) to black
- **Rainbow Effects**: Full spectrum for mane, dust, and victory animation

### Visual Effects
- **Rainbow Dust**: Colorful particles with glow and shadow effects
- **Victory Rainbow**: Full-screen rainbow arc animation on correct hits
- **Heart Transformation**: Dragons fade into pink hearts that float upward
- **Particle Explosions**: Gold particles on correct hits, red on wrong hits
- **Pulsing Target Number**: Animated scale effect for emphasis
- **Fire Breath**: Animated orange/gold flames from dragon nostrils

### UI Elements
- **Target Number**: Large (120px), centered at top, purple with glow
- **Score**: Top right, white text with shadow
- **Timer**: Below score, gold text showing countdown
- **Lives**: Top left, heart emoji display

## Technical Features

### Responsive Design
- Canvas fills entire viewport
- Handles window resize events
- Touch-optimized for mobile devices
- Prevents text selection and default touch behaviors

### Animation & Performance
- 60 FPS target using requestAnimationFrame
- Smooth sprite rotations and movements
- Particle system for visual feedback
- Fade transitions between rounds

### Dragon Group Patterns
- **1-6 dragons**: Standard dice patterns
- **7-10 dragons**: Two dice side by side
  - 7 = 3 + 4
  - 8 = 4 + 4
  - 9 = 4 + 5
  - 10 = 5 + 5
- Spacing ensures dragons don't overlap (50px spacing, 20px dragon size)

### Collision Detection
- Circular collision between rainbow dust and dragons
- Checks all dragons in a group for hits
- Prevents multiple hits during victory animation

## Game States

### Active Play
- Timer counting down
- Dragons moving
- Player can shoot
- Collision detection active

### Victory Animation
- Rainbow arc displays for 1 second
- Dragons transform to hearts
- 2-second fade to black
- New round starts automatically

### Game Over
- Display final score
- Prompt to play again
- Reset score, lives, and game state on restart

## Difficulty Scaling
- **Score 0-49**: 3 dragon groups
- **Score 50-99**: 4 dragon groups
- **Score 100+**: 5 dragon groups (maximum)
- More groups = more choices = harder to identify correct target

## Accessibility Considerations
- Large, clear target number display
- High contrast UI elements
- Visual feedback for all actions
- Touch-friendly controls for mobile
- No time pressure option could be added for accessibility

## Future Enhancement Ideas
- Power-ups (extra time, extra shots, slow motion)
- Different difficulty modes
- Sound effects and background music
- Leaderboard/high score persistence
- Multiple levels with different backgrounds
- Achievement system
- Tutorial/practice mode
