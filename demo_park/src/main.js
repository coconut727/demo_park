import Start from './scenes/Start.js';
import Game from './scenes/Game.js';


const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#000000',
    
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, 
            gravity: { y: 0 } 
        }
    },

    scene: [Start, Game]
};

new Phaser.Game(config);