import Character from './character.js';

export default class NPC extends Character {
    constructor(scene, name, x, y) {
        super(scene, name, x, y);
        this.state = 'idle';
        this.moveSpeed = 100;            // Pixels per second
        this.moveDistance = 2 * 32;        // Two paces (64 pixels)
        this.moveTarget = null;          // Intended target position
        this.moveDirection = null;       // Intended movement vector (e.g., { x: 1, y: 0 })
        this.startPos = { x: this.x, y: this.y };

        // Holds our timer that checks if we reached the target
        this.movementCheckEvent = null;

        // Start the idle/move cycle
        this.scheduleIdle();
    }

    // Enter idle mode and clear movement objectives.
    scheduleIdle() {
        this.state = 'idle';
        this.setVelocity(0, 0);
        this.switchToIdle();
        this.moveTarget = null;
        this.moveDirection = null;
        if (this.movementCheckEvent) {
            this.movementCheckEvent.remove();
            this.movementCheckEvent = null;
        }
        // Wait 1-2 seconds before trying to move.
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 2000),
            callback: this.startMoving,
            callbackScope: this
        });
    }

    // Begin moving in a random cardinal direction toward a target two paces away.
    startMoving() {
        const directions = [
            { x: 1,  y: 0, name: 'right' },
            { x: -1, y: 0, name: 'left' },
            { x: 0,  y: 1, name: 'down' },
            { x: 0,  y: -1, name: 'up' }
        ];
        const chosen = Phaser.Math.RND.pick(directions);
        this.lastDirection = chosen.name;
        this.state = 'moving';

        // Record the starting point.
        this.startPos.x = this.x;
        this.startPos.y = this.y;

        // Save the intended movement direction and compute the target.
        this.moveDirection = { x: chosen.x, y: chosen.y };
        this.moveTarget = {
            x: this.x + chosen.x * this.moveDistance,
            y: this.y + chosen.y * this.moveDistance
        };

        // Set a constant velocity in that direction.
        this.move(chosen.x * this.moveSpeed, chosen.y * this.moveSpeed);

        // Schedule a check in 2 seconds to see if the target was reached.
        if (this.movementCheckEvent) {
            this.movementCheckEvent.remove();
        }
        this.movementCheckEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: this.checkMovementProgress,
            callbackScope: this
        });
    }

    // Check if the NPC is at the target (using a small threshold).
    // If not, cancel the movement objective.
    checkMovementProgress() {
        const threshold = 2; // pixels
        const dx = this.x - this.moveTarget.x;
        const dy = this.y - this.moveTarget.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > threshold) {
            // The NPC hasn't reached its objective after 2 seconds.
            this.stopMoving();
        }
    }

    // Stop moving and return to idle.
    stopMoving() {
        this.setVelocity(0, 0);
        this.switchToIdle();
        if (this.movementCheckEvent) {
            this.movementCheckEvent.remove();
            this.movementCheckEvent = null;
        }
        this.scheduleIdle();
    }

    update(time, delta) {
        super.update(time, delta);
        // If we happen to naturally reach the target before 2 seconds,
        // cancel the check and stop moving.
        if (this.state === 'moving' && this.moveTarget) {
            const threshold = 2; // pixels
            const dx = this.x - this.moveTarget.x;
            const dy = this.y - this.moveTarget.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= threshold) {
                if (this.movementCheckEvent) {
                    this.movementCheckEvent.remove();
                    this.movementCheckEvent = null;
                }
                this.stopMoving();
            }
        }
    }
}
