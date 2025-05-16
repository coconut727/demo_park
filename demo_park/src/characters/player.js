import Character from './character.js';

export default class Player extends Character {
    constructor(scene, name, x, y) {
        super(scene, name, x, y);
        // Set up player-specific keyboard inputs
        this.cursors = scene.input.keyboard.createCursorKeys();
    }
    
    update() {
        const baseSpeed = 150;
        const speedMultiplier = this.cursors.shift.isDown ? 1.5 : 1;
        const speed = baseSpeed * speedMultiplier;
        
        // Check for directional input
        const left = this.cursors.left.isDown;
        const right = this.cursors.right.isDown;
        const up = this.cursors.up.isDown;
        const down = this.cursors.down.isDown;
        
        let velocityX = 0, velocityY = 0;
        let moving = false;
        
        // Determine horizontal movement
        if (left && !right) {
            velocityX = -speed;
            this.lastDirection = 'left';
            moving = true;
        } else if (right && !left) {
            velocityX = speed;
            this.lastDirection = 'right';
            moving = true;
        }
        
        // Determine vertical movement (if horizontal isn't dominant)
        if (up && !down) {
            velocityY = -speed;
            this.lastDirection = 'up';
            moving = true;
        } else if (down && !up) {
            velocityY = speed;
            this.lastDirection = 'down';
            moving = true;
        }
        
        // Move and update animation
        if (moving) {
            this.move(velocityX, velocityY);
        } else {
            this.setVelocity(0, 0);
            this.switchToIdle();
        }
    }
}
