export default class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, name, x, y) {
        // Initialize with the idle texture by default
        super(scene, x, y, `${name}-idle`);
        this.scene = scene;
        this.name = name;
        
        // Add this sprite to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Set depth and adjust body properties if needed
        this.setDepth(2.5);
        this.body.setOffset(0, 16);
        
        // Default facing direction
        this.lastDirection = 'down';

        // Create animations for this character if they don't already exist
        this.createAnimations();
    }
    
    createAnimations() {
        const anims = this.scene.anims;
        // List of animation keys to ensure they are created only once
        const keys = ['idle-right', 'idle-up', 'idle-left', 'idle-down',
                      'walk-right', 'walk-up', 'walk-left', 'walk-down'];
                      
        keys.forEach(key => {
            const animKey = `${this.name}-${key}`;
            if (!anims.exists(animKey)) {
                // Determine the type (idle or walk) and direction from the key
                const [type, direction] = key.split('-');
                // Assuming 6 frames per direction; adjust indices accordingly:
                let startFrame, endFrame;
                switch(direction) {
                    case 'right': startFrame = 0; endFrame = 5; break;
                    case 'up':    startFrame = 6; endFrame = 11; break;
                    case 'left':  startFrame = 12; endFrame = 17; break;
                    case 'down':  startFrame = 18; endFrame = 23; break;
                    default:      startFrame = 0; endFrame = 5;
                }
                
                const spriteKey = `${this.name}-${type}`;
                anims.create({
                    key: animKey,
                    frames: anims.generateFrameNumbers(spriteKey, { start: startFrame, end: endFrame }),
                    frameRate: 10,
                    repeat: -1
                });
            }
        });
    }
    
    playAnimation(animKey) {
        // Only play the animation if it's not already running
        if (!this.anims.currentAnim || this.anims.currentAnim.key !== animKey) {
            this.play(animKey, true);
        }
    }
    
    switchToIdle() {
        // Switch to the idle animation based on the last direction faced
        this.playAnimation(`${this.name}-idle-${this.lastDirection}`);
    }
    
    move(velocityX, velocityY) {
        this.setVelocity(velocityX, velocityY);
        // Determine the direction based on velocity values (prioritizing horizontal movement)
        if (velocityX < 0) {
            this.lastDirection = 'left';
            this.playAnimation(`${this.name}-walk-left`);
        } else if (velocityX > 0) {
            this.lastDirection = 'right';
            this.playAnimation(`${this.name}-walk-right`);
        } else if (velocityY < 0) {
            this.lastDirection = 'up';
            this.playAnimation(`${this.name}-walk-up`);
        } else if (velocityY > 0) {
            this.lastDirection = 'down';
            this.playAnimation(`${this.name}-walk-down`);
        } else {
            this.switchToIdle();
        }
    }
    
    update() {
        // Generic update method for NPCs or other moving characters.
        // You can override or extend this in subclasses.
    }
}
