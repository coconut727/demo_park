export default class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        console.log('🔹 Preloading assets in Start.js...');

        // Load environments JSON to determine world data
        this.load.json('environments', 'assets/environments/environments.json');

        // In your preload() method:
        this.load.audio('sunrise', 'assets/music/sunrise.ogg');
    }

    create(data) {
        // retrieve environment data
        const environments = this.cache.json.get('environments');
        const currentWorld = data.world || 'overworld'; // default to 'overworld' if not set

        if (!environments[currentWorld]) {
            console.error(`World '${currentWorld}' not found in environments.json!`);
            return;
        }

        const worldData = environments[currentWorld];

        this.layerOrder = worldData.layers;
        this.layerOrder.forEach(layer => {
            this.load.image(layer, `assets/environments/${currentWorld}/${layer}.png`);
        });

        if (worldData['collision-map'] && worldData['collision-tiles']) {
            this.load.tilemapTiledJSON('collisionMap', `assets/environments/${currentWorld}/${worldData['collision-map']}`);
            this.load.image('collisionTile', `assets/environments/${currentWorld}/${worldData['collision-tiles']}`);
        }

        // List of all characters you want to load
        const characterNames = ['daniel', 'kyle', 'chan', 'hana', 'john', 'priya', 'tiffany', 'alexandra'];
        const frameWidth = 32;
        const frameHeight = 64;

        // Preload each character's idle and walk spritesheets
        characterNames.forEach(name => {
            this.load.spritesheet(`${name}-idle`, `assets/characters/${name}/${name}-idle.png`, {
                frameWidth,
                frameHeight
            });
            this.load.spritesheet(`${name}-walk`, `assets/characters/${name}/${name}-walk.png`, {
                frameWidth,
                frameHeight
            });
        });

        this.load.start();
        this.load.on('complete', () => {
            console.log(`Assets for ${currentWorld} loaded. Transitioning to Game...`);
            this.scene.start('Game', { worldData: worldData });
        });
    }
}
